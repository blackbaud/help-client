import { BBHelpHelpWidget } from './help-widget';

describe('BBHelpHelpWidget', () => {
  let helpWidget: BBHelpHelpWidget;
  let originalTimeout: number;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    helpWidget = new BBHelpHelpWidget();
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
    spyOn(helpWidget['communicationService'], 'ready').and.returnValue(Promise.resolve());
    helpWidget['elementsLoaded'] = true;
    helpWidget.ready()
      .then(() => {
        expect(helpWidget['communicationService'].ready).toHaveBeenCalled();
        done();
      })
      .catch((err) => {
        console.log(err, 'error 69');
        done();
      });
  });

  it('should return ready when the communication service is ready', (done) => {
    spyOn(helpWidget['communicationService'], 'ready').and.returnValue(Promise.resolve());
    const consoleSpy = spyOn(window.console, 'error').and.callFake(() => { return; });
    helpWidget['elementsLoaded'] = false;
    helpWidget.ready()
      .then(() => {
        expect(helpWidget['communicationService'].ready).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalled();
        done();
      })
      .catch((err) => {
        console.log(err, 'error 69');
        done();
      });
  });

  it('should load from a config', (done) => {
    const fakeConfig = {
      extends: 'test-config'
    };

    spyOn(helpWidget['communicationService'], 'postMessage').and.callFake((message: any) => { return; });
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

    spyOn(helpWidget['communicationService'], 'postMessage').and.callFake((message: any) => { return; });
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

    spyOn(helpWidget['communicationService'], 'postMessage').and.callFake((message: any) => { return; });
    spyOn(helpWidget['widgetRenderer'], 'addInvokerStyles').and.callFake((invoker: any, config: any) => { return; });
    helpWidget['loadCalled'] = false;
    expect(helpWidget['defaultHelpKey']).toBe('default.html');
    helpWidget.load(fakeConfig);
    expect(helpWidget['defaultHelpKey']).toBe('new-default.html');
    done();
  });
});
