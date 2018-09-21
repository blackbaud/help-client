import { BBHelpHelpWidget } from './help-widget';

describe('BBHelpHelpWidget', () => {
  let helpWidget: BBHelpHelpWidget;
  let originalTimeout: number;
  let commReadyStatus: any;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    helpWidget = new BBHelpHelpWidget();
    spyOn(helpWidget['analyticsService'], 'trackEvent');
    spyOn(helpWidget['communicationService'], 'postMessage').and.callFake((message: any) => { return; });
    spyOn(helpWidget['communicationService'], 'ready').and.callFake((message: any) => commReadyStatus);
    spyOn(helpWidget['communicationService'], 'communicationAction').and.callThrough();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should call the createContainer method on the renderer', (done) => {
    const mockContainer = document.createElement('div');
    mockContainer.classList.add('test-div');
    spyOn(helpWidget['widgetRenderer'], 'createContainer').and.returnValue(mockContainer);

    helpWidget['createElements']();

    expect(helpWidget['widgetRenderer'].createContainer).toHaveBeenCalled();
    expect(helpWidget['container']).toBeDefined();
    expect(helpWidget['container']).toBe(mockContainer);
    expect(helpWidget['container'].classList).toContain('test-div');
    done();
  });

  it('should call the createInvoker method on the renderer', (done) => {
    const mockInvoker = document.createElement('button');
    mockInvoker.classList.add('test-button');
    spyOn(helpWidget['widgetRenderer'], 'createInvoker').and.returnValue(mockInvoker);

    helpWidget['createElements']();

    expect(helpWidget['widgetRenderer'].createInvoker).toHaveBeenCalled();
    expect(helpWidget['invoker']).toBeDefined();
    expect(helpWidget['invoker']).toBe(mockInvoker);
    expect(helpWidget['invoker'].classList).toContain('test-button');
    done();
  });

  it('should call the createIframe method on the renderer', (done) => {
    const mockIframe = document.createElement('iframe');
    mockIframe.classList.add('test-iframe');
    spyOn(helpWidget['widgetRenderer'], 'createIframe').and.returnValue(mockIframe);

    helpWidget['createElements']();

    expect(helpWidget['widgetRenderer'].createIframe).toHaveBeenCalled();
    expect(helpWidget['iframe']).toBeDefined();
    expect(helpWidget['iframe']).toBe(mockIframe);
    expect(helpWidget['iframe'].classList).toContain('test-iframe');
    done();
  });

  it('should return ready when the communication service is ready', (done) => {
    commReadyStatus = Promise.resolve();
    helpWidget['elementsLoaded'] = true;
    helpWidget.ready()
      .then(() => {
        expect(helpWidget['communicationService'].ready).toHaveBeenCalled();
        done();
      })
      .catch((err) => {
        console.log('[ERROR]: ', err);
        done();
      });
  });

  it('should return ready when the communication service is ready', (done) => {
    commReadyStatus = Promise.resolve();
    const consoleSpy = spyOn(window.console, 'error').and.callFake(() => { return; });
    helpWidget['elementsLoaded'] = false;
    helpWidget.ready()
      .then(() => {
        expect(helpWidget['communicationService'].ready).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalled();
        done();
      })
      .catch((err) => {
        console.log('[ERROR]: ', err);
        done();
      });
  });

  it('should load from a config', (done) => {
    const fakeConfig = {
      extends: 'test-config',
      hostQueryParams: ''
    };

    spyOn(helpWidget['widgetRenderer'], 'addInvokerStyles').and.callFake((invoker: any, config: any) => { return; });

    helpWidget.load(fakeConfig);

    expect(helpWidget['communicationService'].postMessage).toHaveBeenCalledWith({
      config: fakeConfig,
      messageType: 'user-config'
    });

    expect(helpWidget['widgetRenderer'].addInvokerStyles).toHaveBeenCalledWith(helpWidget['invoker'], fakeConfig);
    done();
  });

  it('should not load from a config if load has been called already', (done) => {
    const fakeConfig = {
      extends: 'test-config'
    };

    spyOn(helpWidget['widgetRenderer'], 'addInvokerStyles').and.callFake((invoker: any, config: any) => { return; });
    helpWidget['loadCalled'] = true;
    helpWidget.load(fakeConfig);

    expect(helpWidget['communicationService'].postMessage).not.toHaveBeenCalled();
    expect(helpWidget['widgetRenderer'].addInvokerStyles).not.toHaveBeenCalled();
    done();
  });

  it('should set the defaultHelpKey if one exits on the config', (done) => {
    const fakeConfig = {
      defaultHelpKey: 'new-default.html',
      extends: 'test-config'
    };

    spyOn(helpWidget['widgetRenderer'], 'addInvokerStyles').and.callFake((invoker: any, config: any) => { return; });
    helpWidget['loadCalled'] = false;
    expect(helpWidget['defaultHelpKey']).toBe('default.html');
    helpWidget.load(fakeConfig);
    expect(helpWidget['defaultHelpKey']).toBe('new-default.html');
    done();
  });

  it('should set the hostQueryParams on the config to the queryParams from the window', (done) => {
    const fakeConfig = {
      defaultHelpKey: 'new-default.html',
      extends: 'test-config'
    };

    helpWidget['loadCalled'] = false;
    helpWidget['getQueryParams'] = jasmine.createSpy('getQueryParams').and.callFake(() => {
      return '?host-params=true&helplocale=en-us';
    });

    helpWidget.load(fakeConfig);

    expect(helpWidget['communicationService'].postMessage).toHaveBeenCalledWith({
      config: {
        defaultHelpKey: 'new-default.html',
        extends: 'test-config',
        hostQueryParams: '?host-params=true&helplocale=en-us'
      },
      messageType: 'user-config'
    });

    done();
  });

  it('should open the help widget', (done) => {
    helpWidget.load({});
    expect(helpWidget['container'].classList).toContain('bb-help-closed');
    helpWidget.open();
    expect(helpWidget['container'].classList).not.toContain('bb-help-closed');
    expect(document.activeElement.id).toEqual(helpWidget['invoker'].id);
    done();
  });

  it('should open the help widget with a helpKey', (done) => {
    const testHelpKey = 'test-key.html';

    helpWidget.open(testHelpKey);

    expect(helpWidget['communicationService'].postMessage).toHaveBeenCalledWith({
      helpKey: testHelpKey,
      messageType: 'open-to-help-key'
    });

    done();
  });

  it('should not open the help widget if the widget is disbaled', (done) => {
    helpWidget.load({});
    helpWidget['widgetDisabled'] = true;
    expect(helpWidget['container'].classList).toContain('bb-help-closed');
    helpWidget.open();
    expect(helpWidget['container'].classList).toContain('bb-help-closed');
    done();
  });

  it('should close the help widget', (done) => {
    helpWidget.load({});
    helpWidget.open();
    expect(helpWidget['container'].classList).not.toContain('bb-help-closed');
    helpWidget.close();
    expect(helpWidget['container'].classList).toContain('bb-help-closed');
    done();
  });

  it ('should add an event to the invoker, triggering toggleOpen on click', (done) => {
    const fakeConfig = {
      extends: 'test-config'
    };
    spyOn(helpWidget, 'toggleOpen').and.callThrough();
    helpWidget.load(fakeConfig);
    helpWidget['invoker'].click();
    expect(helpWidget.toggleOpen).toHaveBeenCalled();
    expect(helpWidget['container'].classList).not.toContain('bb-help-closed');
    done();
  });

  it ('should close the widget with toggleOpen if the widget is already open', (done) => {
    const fakeConfig = {
      extends: 'test-config'
    };
    helpWidget.load(fakeConfig);
    helpWidget.open();
    spyOn(helpWidget, 'toggleOpen').and.callThrough();
    helpWidget['invoker'].click();
    expect(helpWidget['container'].classList).toContain('bb-help-closed');
    expect(helpWidget.toggleOpen).toHaveBeenCalled();
    done();
  });

  it ('should pass a helpKey to the open method from toggleOpen', (done) => {
    const testHelpKey = 'test-key.html';

    spyOn(helpWidget, 'toggleOpen').and.callThrough();
    helpWidget.toggleOpen(testHelpKey);

    expect(helpWidget['communicationService'].postMessage).toHaveBeenCalledWith({
      helpKey: testHelpKey,
      messageType: 'open-to-help-key'
    });
    done();
  });

  it('should set and send widget currentHelpKey to help SPA', (done) => {
    const testKey = 'help.html';
    const expectedCall = {
      helpKey: testKey,
      messageType: 'update-current-help-key'
    };
    helpWidget['elementsLoaded'] = true;
    helpWidget.setCurrentHelpKey(testKey);
    expect(helpWidget.currentHelpKey).toEqual(testKey);
    expect(helpWidget['communicationService'].postMessage).toHaveBeenCalledWith(expectedCall);
    done();
  });

  it('should set the helpKey to the defaultHelpKey if no helpKey is passed to setCurrentHelpKey', (done) => {
    const expectedCall = {
      helpKey: helpWidget['defaultHelpKey'],
      messageType: 'update-current-help-key'
    };
    helpWidget.setCurrentHelpKey(undefined);
    expect(helpWidget.currentHelpKey).toEqual(helpWidget['defaultHelpKey']);
    expect(helpWidget['communicationService'].postMessage).toHaveBeenCalledWith(expectedCall);
    done();
  });

  it('should set the help key to the default help key', (done) => {
    const expectedCall = {
      helpKey: helpWidget['defaultHelpKey'],
      messageType: 'update-current-help-key'
    };
    helpWidget.setHelpKeyToDefault();
    expect(helpWidget['communicationService'].postMessage).toHaveBeenCalledWith(expectedCall);
    done();
  });

  it('should return the current helpkey from the getHelpKey method', (done) => {
    const testKey = 'test-key.html';
    helpWidget.setCurrentHelpKey(testKey);
    const returnedKey = helpWidget['getHelpKey']();
    expect(returnedKey).toEqual(testKey);
    done();
  });

  it('should return the default helpkey from the getHelpKey method if no currentHelpKey exists', (done) => {
    helpWidget.currentHelpKey = undefined;
    const returnedKey = helpWidget['getHelpKey']();
    expect(returnedKey).toEqual(helpWidget['defaultHelpKey']);
    done();
  });

  it('should override its getCurrentHelpKey variable with one from the config (string value)', (done) => {
    const fakeKey = 'my-test-key.html';
    const fakeConfig = {
      getCurrentHelpKey: fakeKey
    };

    spyOn(helpWidget['widgetRenderer'], 'addInvokerStyles').and.callFake((invoker: any, config: any) => { return; });
    helpWidget['loadCalled'] = false;
    helpWidget.load(fakeConfig);
    const returnedKey = helpWidget['getHelpKey']();
    expect(returnedKey).toEqual(fakeKey);
    done();
  });

  it('should override its getCurrentHelpKey variable with one from the config (function value)', (done) => {
    const fakeKey = 'fake-test-key.html';
    const fakeConfig = {
      getCurrentHelpKey: () => fakeKey
    };

    spyOn(helpWidget['widgetRenderer'], 'addInvokerStyles').and.callFake((invoker: any, config: any) => { return; });
    helpWidget['loadCalled'] = false;
    helpWidget.load(fakeConfig);
    const returnedKey = helpWidget['getHelpKey']();

    expect(returnedKey).toEqual(fakeKey);
    done();
  });

  it ('should disable the help widget', (done) => {
    expect(helpWidget['widgetDisabled']).toBe(false);
    helpWidget.disableWidget();
    expect(helpWidget['widgetDisabled']).toBe(true);
    expect(helpWidget['invoker'].classList).toContain('bb-help-hidden');
    expect(helpWidget['container'].classList).toContain('bb-help-hidden');
    done();
  });

  it ('should re-enable the help widget', (done) => {
    expect(helpWidget['widgetDisabled']).toBe(false);
    helpWidget.disableWidget();
    expect(helpWidget['widgetDisabled']).toBe(true);
    expect(helpWidget['invoker'].classList).toContain('bb-help-hidden');
    expect(helpWidget['container'].classList).toContain('bb-help-hidden');

    helpWidget.enableWidget();
    expect(helpWidget['widgetDisabled']).toBe(false);
    expect(helpWidget['invoker'].classList).not.toContain('bb-help-hidden');
    expect(helpWidget['container'].classList).not.toContain('bb-help-hidden');
    done();
  });

  it ('should respond to action responses, Close Widget', (done) => {
    spyOn(helpWidget, 'close').and.callThrough();
    helpWidget['communicationService'].communicationAction.next('Close Widget');
    expect(helpWidget.close).toHaveBeenCalled();
    console.log(document.activeElement);
    expect(document.activeElement.id).toEqual(helpWidget['invoker'].id);
    done();
  });

  it ('should respond to action responses, Child Window Ready (loadCalled false) by not sending the config', (done) => {
    helpWidget['communicationService'].communicationAction.next('Child Window Ready');
    expect(helpWidget['communicationService'].postMessage).not.toHaveBeenCalled();
    done();
  });

  it ('should respond to action responses, Child Window Ready (loadCalled true) by sending the config', (done) => {
    const fakeConfig = {
      defaultHelpKey: 'test-default.html'
    };

    helpWidget.load(fakeConfig);
    helpWidget['communicationService'].communicationAction.next('Child Window Ready');
    expect(helpWidget['communicationService'].postMessage).toHaveBeenCalledWith({
      config: helpWidget.config,
      messageType: 'user-config'
    });
    done();
  });

  it ('should log a console error if no matching action exists', (done) => {
    const testAction = 'Test Action No Response';
    spyOn(window.console, 'error').and.callFake(() => {
      return;
    });
    helpWidget['communicationService'].communicationAction.next(testAction);
    expect(window.console.error).toHaveBeenCalledWith(`No matching response for action: ${testAction}`);
    done();
  });

  it('should assess what\'s new revision and return revision number', () => {
    const fakeConfig = {
      productId: 'rex',
      whatsNewRevisions: 'rex=30;'
    };
    helpWidget.load(fakeConfig);
    expect(helpWidget.getWhatsNewRevision()).toEqual(30);
  });

  it('should assess what\'s new revision and return revision number from several revisions', () => {
    const fakeConfig = {
      productId: 'fe',
      whatsNewRevisions: 'rex=30;fe=10;lo=15'
    };
    helpWidget.load(fakeConfig);
    expect(helpWidget.getWhatsNewRevision()).toEqual(10);
  });

  it('should assess what\'s new revision with no found revision and return 0', () => {
    const fakeConfig = {
      productId: 'fe',
      whatsNewRevisions: 'rex=30;'
    };
    helpWidget.load(fakeConfig);
    expect(helpWidget.getWhatsNewRevision()).toEqual(0);
  });

  it('should assess what\'s new revision with undefined whatsNewRevisions property and return 0', () => {
    const fakeConfig = {
      productId: 'rex'
    };
    helpWidget.load(fakeConfig);
    expect(helpWidget.getWhatsNewRevision()).toEqual(0);
  });

  it('should add the mobile container class when the window screen width is SCREEN_XS_MAX and below ', (done) => {
    (window as any).innerWidth = 767;
    window.dispatchEvent(new Event('resize'));
    expect(helpWidget['container'].classList).toContain('bb-help-container-mobile');
    done();
  });

  it('should add the mobile container class when the window screen height is the panel height and below ', (done) => {
    (window as any).innerWidth = 1000;
    (window as any).innerHeight = 400;
    window.dispatchEvent(new Event('resize'));
    expect(helpWidget['container'].classList).toContain('bb-help-container-mobile');
    done();
  });

  it('should not add the mobile container class when window dimentions are greater than specified values', (done) => {
    (window as any).innerWidth = 1000;
    (window as any).innerHeight = 1000;
    window.dispatchEvent(new Event('resize'));
    expect(helpWidget['container'].classList).not.toContain('bb-help-container-mobile');
    done();
  });

  it('should update the container classes on window resize', (done) => {
    (window as any).innerWidth = 1000;
    (window as any).innerHeight = 1000;
    window.dispatchEvent(new Event('resize'));
    expect(helpWidget['container'].classList).not.toContain('bb-help-container-mobile');
    (window as any).innerHeight = 400;
    window.dispatchEvent(new Event('resize'));
    expect(helpWidget['container'].classList).toContain('bb-help-container-mobile');
    done();
  });
});
