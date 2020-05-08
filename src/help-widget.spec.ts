import { BBHelpHelpWidget } from './help-widget';
import { MockCommunicationService } from './mocks/mock-communication-service';
import { MockWidgetRenderer} from './mocks/mock-renderer';
import { MockStyleUtility } from './mocks/mock-style-utilty';

describe('BBHelpHelpWidget', () => {
  let helpWidget: BBHelpHelpWidget;
  let originalTimeout: number;
  let mockWidgetRenderer: any;
  let mockCommunicationService: any;
  let mockStyleUtility: any;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    mockWidgetRenderer = new MockWidgetRenderer();
    mockCommunicationService = new MockCommunicationService();
    mockStyleUtility = new MockStyleUtility();
    helpWidget = new BBHelpHelpWidget(
      mockWidgetRenderer,
      mockCommunicationService,
      mockStyleUtility
    );
    helpWidget.init();
    spyOn(mockCommunicationService, 'postMessage').and.callThrough();
    spyOn(mockCommunicationService, 'ready').and.callThrough();
    spyOn(mockCommunicationService, 'communicationAction').and.callThrough();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should call the createContainer method on the renderer', (done) => {
    const mockContainer = document.createElement('div');
    mockContainer.classList.add('test-div');
    spyOn(mockWidgetRenderer, 'createContainer').and.returnValue(mockContainer);
    helpWidget['createElements']();

    expect(mockWidgetRenderer.createContainer).toHaveBeenCalled();
    expect(helpWidget['container']).toBeDefined();
    expect(helpWidget['container']).toBe(mockContainer);
    expect(helpWidget['container'].classList).toContain('test-div');
    done();
  });

  it('should call the createInvoker method on the renderer', (done) => {
    const mockInvoker = document.createElement('button');
    mockInvoker.classList.add('test-button');
    spyOn(mockWidgetRenderer, 'createInvoker').and.returnValue(mockInvoker);

    helpWidget['createElements']();

    expect(mockWidgetRenderer.createInvoker).toHaveBeenCalled();
    expect(helpWidget['invoker']).toBeDefined();
    expect(helpWidget['invoker']).toBe(mockInvoker);
    expect(helpWidget['invoker'].classList).toContain('test-button');
    done();
  });

  it('should call the createIframe method on the renderer', (done) => {
    const mockIframe = document.createElement('iframe');
    mockIframe.classList.add('test-iframe');
    spyOn(mockWidgetRenderer, 'createIframe').and.returnValue(mockIframe);

    helpWidget['createElements']();

    expect(mockWidgetRenderer.createIframe).toHaveBeenCalled();
    expect(helpWidget['iframe']).toBeDefined();
    expect(helpWidget['iframe']).toBe(mockIframe);
    expect(helpWidget['iframe'].classList).toContain('test-iframe');
    done();
  });

  it('should return ready when the communication service is ready', (done) => {
    mockCommunicationService.commReadyStatus = Promise.resolve();
    helpWidget['elementsLoaded'] = true;
    helpWidget.ready()
      .then(() => {
        expect(mockCommunicationService.ready).toHaveBeenCalled();
        done();
      })
      .catch((err) => {
        console.log('[ERROR]: ', err);
        done();
      });
  });

  it('should not return ready when the communication service is not ready', (done) => {
    mockCommunicationService.commReadyStatus = Promise.resolve();
    const consoleSpy = spyOn(window.console, 'error').and.callFake(() => { return; });
    helpWidget['elementsLoaded'] = false;
    helpWidget.ready()
      .then(() => {
        expect(mockCommunicationService.ready).not.toHaveBeenCalled();
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

    spyOn(mockWidgetRenderer, 'addInvokerStyles').and.callFake((invoker: any, config: any) => {
      return;
    });

    helpWidget.load(fakeConfig).then(() => {
      expect(mockCommunicationService.postMessage).toHaveBeenCalledWith({
        config: fakeConfig,
        messageType: 'user-config'
      });
      done();
    })
    .catch(() => {
      done.fail('The help widget was not configured.');
    });
  });

  it('should not pass the config to the Help Widget if the Help Widget is not ready', (done) => {
    const helpSendConfig = spyOn<any>(helpWidget, 'sendConfig').and.callThrough();
    const helpReady = spyOn(helpWidget, 'ready').and.returnValue(Promise.reject('error message'));
    const config = {
      productId: 'lo'
    };

    helpWidget
      .load(config)
      .then(() => {
        done();
      })
      .catch(() => {
        expect(helpReady).toHaveBeenCalled();
        expect(helpSendConfig).not.toHaveBeenCalled();
        done();
      });
  });

  it('should not load from a config if load has been called already', (done) => {
    const fakeConfig = {
      extends: 'test-config'
    };

    spyOn(mockWidgetRenderer, 'addInvokerStyles').and.callFake((invoker: any, config: any) => { return; });
    helpWidget['loadCalled'] = true;
    helpWidget.load(fakeConfig);

    expect(mockCommunicationService.postMessage).not.toHaveBeenCalled();
    expect(mockWidgetRenderer.addInvokerStyles).not.toHaveBeenCalled();
    done();
  });

  it('should set the defaultHelpKey if one exits on the config', (done) => {
    const fakeConfig = {
      defaultHelpKey: 'new-default.html',
      extends: 'test-config'
    };

    spyOn(mockWidgetRenderer, 'addInvokerStyles').and.callFake((invoker: any, config: any) => { return; });
    helpWidget['loadCalled'] = false;
    expect(helpWidget['defaultHelpKey']).toBe('default.html');
    helpWidget.load(fakeConfig).then(() => {
      expect(helpWidget['defaultHelpKey']).toBe('new-default.html');
      done();
    })
    .catch(() => {
      done.fail('The help widget was not configured.');
    });
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

    helpWidget.load(fakeConfig).then(() => {
      expect(mockCommunicationService.postMessage).toHaveBeenCalledWith({
        config: {
          defaultHelpKey: 'new-default.html',
          extends: 'test-config',
          hostQueryParams: '?host-params=true&helplocale=en-us'
        },
        messageType: 'user-config'
      });
      done();
    })
    .catch(() => {
      done.fail('The help widget was not configured.');
    });
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

    expect(mockCommunicationService.postMessage).toHaveBeenCalledWith({
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

    expect(mockCommunicationService.postMessage).toHaveBeenCalledWith({
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
    expect(mockCommunicationService.postMessage).toHaveBeenCalledWith(expectedCall);
    done();
  });

  it('should set the helpKey to the defaultHelpKey if no helpKey is passed to setCurrentHelpKey', (done) => {
    const expectedCall = {
      helpKey: helpWidget['defaultHelpKey'],
      messageType: 'update-current-help-key'
    };
    helpWidget.setCurrentHelpKey(undefined);
    expect(helpWidget.currentHelpKey).toEqual(helpWidget['defaultHelpKey']);
    expect(mockCommunicationService.postMessage).toHaveBeenCalledWith(expectedCall);
    done();
  });

  it('should set the help key to the default help key', (done) => {
    const expectedCall = {
      helpKey: helpWidget['defaultHelpKey'],
      messageType: 'update-current-help-key'
    };
    helpWidget.setHelpKeyToDefault();
    expect(mockCommunicationService.postMessage).toHaveBeenCalledWith(expectedCall);
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

    spyOn(mockWidgetRenderer, 'addInvokerStyles').and.callFake((invoker: any, config: any) => { return; });
    helpWidget['loadCalled'] = false;
    helpWidget.load(fakeConfig).then(() => {
      const returnedKey = helpWidget['getHelpKey']();
      expect(returnedKey).toEqual(fakeKey);
      done();
    });
  });

  it('should override its getCurrentHelpKey variable with one from the config (function value)', (done) => {
    const fakeKey = 'fake-test-key.html';
    const fakeConfig = {
      getCurrentHelpKey: () => fakeKey
    };

    spyOn(mockWidgetRenderer, 'addInvokerStyles').and.callFake((invoker: any, config: any) => { return; });
    helpWidget['loadCalled'] = false;
    helpWidget.load(fakeConfig).then(() => {
      const returnedKey = helpWidget['getHelpKey']();
      expect(returnedKey).toEqual(fakeKey);
      done();
    })
    .catch(() => {
      done.fail('The help widget was not configured.');
    });
  });

  it('should override its onHelpLoaded variable with one from the config (function value)', (done) => {
    const testResponse = 'test response';
    const fakeConfig = {
      onHelpLoaded: () => {
        return(testResponse);
      }
    };

    helpWidget['loadCalled'] = false;
    helpWidget.load(fakeConfig).then(() => {
      expect(helpWidget.onHelpLoaded()).toBe(testResponse);
      done();
    })
    .catch(() => {
      done.fail('The help widget was not configured.');
    });
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

  it ('should react to actions, Close Widget', (done) => {
    spyOn(helpWidget, 'close').and.callThrough();
    mockCommunicationService.communicationAction.next({ messageType: 'Close Widget' });
    expect(helpWidget.close).toHaveBeenCalled();
    expect(document.activeElement.id).toEqual(helpWidget['invoker'].id);
    done();
  });

  it ('should react to actions, Open Widget', (done) => {
    spyOn(helpWidget, 'open').and.callThrough();
    mockCommunicationService.communicationAction.next({ messageType: 'Open Widget', helpKey: 'whats-new.html' });
    expect(helpWidget.open).toHaveBeenCalledWith('whats-new.html');
    expect(document.activeElement.id).toEqual(helpWidget['invoker'].id);
    done();
  });

  it ('should react to actions, Child Window Ready (loadCalled false) by not sending the config', (done) => {
    const consoleSpy = spyOn(window.console, 'error').and.callFake(() => { return; });
    mockCommunicationService.communicationAction.next({ messageType: 'Child Window Ready' });
    expect(mockCommunicationService.postMessage).not.toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();
    done();
  });

  it ('should react to actions, Child Window Ready (loadCalled true) by sending the config', (done) => {
    const fakeConfig = {
      defaultHelpKey: 'test-default.html'
    };

    helpWidget.load(fakeConfig).then(() => {
      mockCommunicationService.communicationAction.next({ messageType: 'Child Window Ready' });
      expect(mockCommunicationService.postMessage).toHaveBeenCalledWith({
        config: helpWidget.config,
        messageType: 'user-config'
      });
      done();
    })
    .catch(() => {
      done.fail('The help widget was not configured.');
    });
  });

  it ('should react to actions, Config Loaded by updating configs, defaultHelpKey, and render invoker', (done) => {
    const originalConfig = {
      defaultHelpKey: 'original-default.html',
      onHelpLoaded: () => true
    };

    const extendedConfig = {
      defaultHelpKey: 'new-default.html',
      headerColor: '#fff'
    };

    const rendererSpy = spyOn(mockWidgetRenderer, 'addInvokerStyles').and.callThrough();
    helpWidget.load(originalConfig).then(() => {
      expect(helpWidget.config).toEqual(originalConfig);
      expect(helpWidget['defaultHelpKey']).toEqual(originalConfig.defaultHelpKey);
      mockCommunicationService.communicationAction.next({
        data: JSON.stringify(extendedConfig),
        messageType: 'Config Loaded'
      });
      expect(rendererSpy).toHaveBeenCalledWith(helpWidget['invoker'], extendedConfig);
      expect(helpWidget.config).toEqual(extendedConfig);
      expect(helpWidget['defaultHelpKey']).toEqual(extendedConfig.defaultHelpKey);
      done();
    })
    .catch(() => {
      done.fail('The help widget was not configured.');
    });
  });

  it ('should react to actions, Config Loaded by updating configs (no defaultHelpKey) and render invoker', (done) => {
    const originalConfig = {
      defaultHelpKey: 'original-default.html'
    };

    const extendedConfig = {
      headerColor: '#fff'
    };

    const rendererSpy = spyOn(mockWidgetRenderer, 'addInvokerStyles').and.callThrough();
    helpWidget.load(originalConfig).then(() => {
      expect(helpWidget.config).toEqual(originalConfig);
      mockCommunicationService.communicationAction.next({
        data: JSON.stringify(extendedConfig),
        messageType: 'Config Loaded'
      });
      expect(rendererSpy).toHaveBeenCalledWith(helpWidget['invoker'], extendedConfig);
      expect(helpWidget.config).toEqual(extendedConfig);
      expect(helpWidget['defaultHelpKey']).toEqual(originalConfig.defaultHelpKey);
      done();
    })
    .catch(() => {
      done.fail('The help widget was not configured.');
    });
  });

  it ('should log a console error if no matching action exists', (done) => {
    const testAction = { messageType: 'Test Action No Response' };
    spyOn(window.console, 'error').and.callFake(() => {
      return;
    });
    mockCommunicationService.communicationAction.next(testAction);
    expect(window.console.error).toHaveBeenCalledWith(`No matching response for action: ${testAction.messageType}`);
    done();
  });

  it('should assess what\'s new revision and return revision number', (done) => {
    const fakeConfig = {
      productId: 'rex',
      whatsNewRevisions: 'rex=30;'
    };
    helpWidget.load(fakeConfig).then(() => {
      expect(helpWidget.getWhatsNewRevision()).toEqual(30);
      done();
    })
    .catch(() => {
      done.fail('The help widget was not configured.');
    });
  });

  it('should assess what\'s new revision and return revision number from several revisions', (done) => {
    const fakeConfig = {
      productId: 'fe',
      whatsNewRevisions: 'rex=30;fe=10;lo=15'
    };
    helpWidget.load(fakeConfig).then(() => {
      expect(helpWidget.getWhatsNewRevision()).toEqual(10);
      done();
    })
    .catch(() => {
      done.fail('The help widget was not configured.');
    });
  });

  it('should assess what\'s new revision with no found revision and return 0', (done) => {
    const fakeConfig = {
      productId: 'fe',
      whatsNewRevisions: 'rex=30;'
    };
    helpWidget.load(fakeConfig).then(() => {
      expect(helpWidget.getWhatsNewRevision()).toEqual(0);
      done();
    })
    .catch(() => {
      done.fail('The help widget was not configured.');
    });
  });

  it('should assess what\'s new revision with undefined whatsNewRevisions property and return 0', (done) => {
    const fakeConfig = {
      productId: 'rex'
    };
    helpWidget.load(fakeConfig).then(() => {
      expect(helpWidget.getWhatsNewRevision()).toEqual(0);
      done();
    })
    .catch(() => {
      done.fail('The help widget was not configured.');
    });
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

  it('should add the mobile width invoker class when screen is below mobile width', (done) => {
    (window as any).innerWidth = 700;
    (window as any).innerHeight = 1000;
    window.dispatchEvent(new Event('resize'));
    expect(helpWidget['invoker'].classList).toContain('bb-help-mobile-width');
    done();
  });

  it('should not add the mobile width invoker class when screen is above mobile width', (done) => {
    (window as any).innerWidth = 1000;
    (window as any).innerHeight = 400;
    window.dispatchEvent(new Event('resize'));
    expect(helpWidget['invoker'].classList).not.toContain('bb-help-mobile-width');
    done();
  });

  it('should not add the mobile container class when window dimensions are greater than specified values', (done) => {
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

  it('should sanitize config options to remove functions', () => {
    const originalConfig = {
      defaultHelpKey: 'original-default.html',
      onHelpLoaded: () => true
    };
    const finalConfig = {
      defaultHelpKey: 'original-default.html'
    };
    helpWidget.config = originalConfig;
    helpWidget['sanitizeConfig']();
    expect(helpWidget.config).toEqual(finalConfig);
  });
});
