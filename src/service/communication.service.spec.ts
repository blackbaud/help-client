import { BBHelpCommunicationService } from './communication.service';

const HOST_ORIGIN: string = 'https://host.nxt.blackbaud.com';
let triggerEvent: any;

function fakeMessageTrigger(listenerType: string, cb: any) {
  triggerEvent = (event: any) => {
    cb(event);
  };
}

const mockChildWindow = {
    contentWindow: {
      postMessage: jasmine.createSpy('postMessage').and.callFake(() => {
        return;
      })
    }
};

describe('BBHelpCommunicationService', () => {
  let commService: BBHelpCommunicationService;
  let originalTimeout: number;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    spyOn(window, 'addEventListener').and.callFake(fakeMessageTrigger);

    commService = new BBHelpCommunicationService(mockChildWindow);
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should return ready when the childWindowReady is true', (done) => {
    commService.childWindowReady = true;
    commService.ready()
      .then((response) => {
        expect(response).toEqual('Communication Service Ready');
        done();
      });
  });

  it('should return an error when the childWindowReady is false past iterations', (done) => {
    commService.childWindowReady = false;
    commService.ready()
      .then(() => {
        return Promise.reject('test failed');
      })
      .catch((error) => {
        expect(error).toEqual('The Help Widget failed to load.');
        done();
      });
  });

  it('should return true if the origin is from the Help Widget', (done) => {
    const event = {
      data: {
        message: 'test-data',
        source: 'skyux-spa-bb-help'
      },
      origin: HOST_ORIGIN
    };

    const testSource = commService.isFromHelpWidget(event);

    expect(testSource).toBe(true);
    done();
  });

  it('should return false if the origin is not from the Help Widget', (done) => {
    const event = {
      data: {
        message: 'test-data',
        source: 'skyux-spa-bb-help'
      },
      origin: 'Other Source'
    };

    const testSource = commService.isFromHelpWidget(event);

    expect(testSource).toBe(false);
    done();
  });

  it('should return false if there is no message from the Help Widget', (done) => {
    const event = {
      data: false,
      origin: HOST_ORIGIN
    };

    const testSource = commService.isFromHelpWidget(event);

    expect(testSource).toBe(false);
    done();
  });

  it('should post a message and origin to the child window', (done) => {
    const origin = 'test-origin';
    const message = {
      message: 'test-data'
    };

    commService.postMessage(message, origin);
    expect(mockChildWindow.contentWindow.postMessage).toHaveBeenCalled();
    done();
  });

  it('should post add the message source as \'help-client\' before posting the message', (done) => {
    const origin = 'test-origin';
    const message = {
      message: 'test-data'
    };

    commService.postMessage(message, origin);
    expect(mockChildWindow.contentWindow.postMessage).toHaveBeenCalledWith({
      message: 'test-data',
      source: 'help-client'
    }, origin);
    done();
  });

  it('should use the default host origin if none is provided', (done) => {
    const message = {
      message: 'test-data'
    };

    commService.postMessage(message);
    expect(mockChildWindow.contentWindow.postMessage).toHaveBeenCalledWith({
      message: 'test-data',
      source: 'help-client'
    }, HOST_ORIGIN);
    done();
  });

  it('should handle messages from the window, (ready)', (done) => {
    const event = {
      data: {
        messageType: 'ready',
        source: 'skyux-spa-bb-help'
      },
      origin: HOST_ORIGIN
    };

    spyOn(commService, 'postMessage').and.callThrough();
    spyOn(commService.communicationAction, 'next').and.callThrough();
    triggerEvent(event);
    expect(commService.postMessage).toHaveBeenCalledWith({ messageType: 'host-ready', source: 'help-client' });
    expect(commService.communicationAction.next).toHaveBeenCalledWith('Child Window Ready');
    expect(commService.childWindowReady).toBe(true);
    done();
  });

  it('should handle messages from the window, (close-widget)', (done) => {
    const event = {
      data: {
        messageType: 'close-widget',
        source: 'skyux-spa-bb-help'
      },
      origin: HOST_ORIGIN
    };

    spyOn(commService.communicationAction, 'next').and.callThrough();
    triggerEvent(event);
    expect(commService.communicationAction.next).toHaveBeenCalledWith('Close Widget');
    done();
  });

  it('should handle messages from the window, (unsupported messageType)', (done) => {
    const testMessageType = 'Test Message Type';
    const event = {
      data: {
        messageType: testMessageType,
        source: 'skyux-spa-bb-help'
      },
      origin: HOST_ORIGIN
    };

    spyOn(window.console, 'error').and.callFake(() => {
      return;
    });
    triggerEvent(event);
    expect(window.console.error).toHaveBeenCalledWith(`No matching response for message type: ${testMessageType}`);
    done();
  });

  it('should not try to handle messages from sources other than the skyux-spa-bb-help', (done) => {
    spyOn(commService.communicationAction, 'next').and.callThrough();
    spyOn(window.console, 'error').and.callThrough();
    const testMessageType = 'Test Message Type';
    const event = {
      data: {
        messageType: testMessageType,
        source: 'skyux-spa-bb-help'
      },
      origin: 'Other Source'
    };
    triggerEvent(event);
    expect(commService.communicationAction.next).not.toHaveBeenCalled();
    expect(window.console.error).not.toHaveBeenCalled();
    done();
  });
});
