import { BBHelpCommunicationService } from './communication.service';

const HOST_ORIGIN: string = 'https://host.nxt.blackbaud.com';
let currentMessageListener: Function;
let listeners: Record<string, Function> = {};

function addListener(listenerType: string, cb: Function) {
  listeners[listenerType] = cb;
  if (listenerType === 'message') {
    currentMessageListener = cb;
  }
}

function removeListener(type: string, callback: Function) {
  const listener = listeners[type];
  if (listener === callback) {
    delete listeners[type];
    currentMessageListener = undefined;
  }
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

    spyOn(window, 'addEventListener').and.callFake(addListener);
    spyOn(window, 'removeEventListener').and.callFake(removeListener);

    commService = new BBHelpCommunicationService();
    commService.bindChildWindowReference(mockChildWindow);
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
        expect(error).toEqual('The Help Widget\'s Communication Service failed to load.');
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

    const communicationListenerSpy = jasmine.createSpy('listener');
    commService.setListener(communicationListenerSpy);

    spyOn(commService, 'postMessage').and.callThrough();
    currentMessageListener(event);
    expect(commService.postMessage).toHaveBeenCalledWith({ messageType: 'host-ready', source: 'help-client' });
    expect(communicationListenerSpy).toHaveBeenCalledWith({ messageType: 'Child Window Ready' });
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

    const communicationListenerSpy = jasmine.createSpy('listener');
    commService.setListener(communicationListenerSpy);

    currentMessageListener(event);
    expect(communicationListenerSpy).toHaveBeenCalledWith({ messageType: 'Close Widget'});
    done();
  });

  it('should handle messages from the window, (open-widget)', (done) => {
    const event = {
      data: {
        helpKey: 'whats-new.html',
        messageType: 'open-widget',
        source: 'skyux-spa-bb-help'
      },
      origin: HOST_ORIGIN
    };

    const communicationListenerSpy = jasmine.createSpy('listener');
    commService.setListener(communicationListenerSpy);

    currentMessageListener(event);
    expect(communicationListenerSpy).toHaveBeenCalledWith({
      helpKey: 'whats-new.html',
      messageType: 'Open Widget'
    });
    done();
  });

  it('should handle messages from the window, (config-loaded)', (done) => {
    const event = {
      data: {
        data: {
          defaultHelpKey: 'new-default.html'
        },
        messageType: 'config-loaded',
        source: 'skyux-spa-bb-help'
      },
      origin: HOST_ORIGIN
    };

    const communicationListenerSpy = jasmine.createSpy('listener');
    commService.setListener(communicationListenerSpy);

    currentMessageListener(event);
    expect(communicationListenerSpy).toHaveBeenCalledWith({
      data: event.data.data,
      messageType: 'Config Loaded'
    });
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
    currentMessageListener(event);
    expect(window.console.error).toHaveBeenCalledWith(`No matching response for message type: ${testMessageType}`);
    done();
  });

  it('should not try to handle messages from sources other than the skyux-spa-bb-help', (done) => {
    const communicationListenerSpy = jasmine.createSpy('listener');
    commService.setListener(communicationListenerSpy);

    spyOn(window.console, 'error').and.callThrough();
    const testMessageType = 'Test Message Type';
    const event = {
      data: {
        messageType: testMessageType,
        source: 'skyux-spa-bb-help'
      },
      origin: 'Other Source'
    };
    currentMessageListener(event);
    expect(communicationListenerSpy).not.toHaveBeenCalled();
    expect(window.console.error).not.toHaveBeenCalled();
    done();
  });

  it('should reset state on unload', async () => {
    const readyEvent = {
      data: {
        messageType: 'ready',
        source: 'skyux-spa-bb-help'
      },
      origin: HOST_ORIGIN
    };
    currentMessageListener(readyEvent);
    await commService.ready()
      .then(() => commService.unload())
      .then(() => {
        expect(listeners.message).toBeUndefined();
        expect(currentMessageListener).toBeUndefined();
        expect(commService.childWindow).toBeUndefined();
        expect(commService.childWindowReady).toBe(false);
      });
  });
});
