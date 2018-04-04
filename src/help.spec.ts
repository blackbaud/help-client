import { } from 'jasmine';

import { BBHelpClient } from './help';
import * as utils from './register-script';

describe('help-client', () => {
  const testCss: string = '{ background-color: red }';
  let originalTimeout: number;
  let registerScriptSpy: jasmine.Spy;
  let fakeHelp: any;
  let headStyles = '';

  const mockCreateElement = (): any => {
    return {
      appendChild(cssStyles: any) { this.cssStyles = cssStyles; },
      cssStyles: '',
      type: undefined
    };
  };

  const mockCreateTextNode = (css: any) => {
    return testCss;
  };

  const mockHeadAppendChild = (styleObject: any) => {
    headStyles = styleObject.cssStyles;
  };

  beforeAll(() => {
    registerScriptSpy = spyOn(
      utils, 'registerScript'
    ).and.callFake(() => {
      (window as any).BBHELP = fakeHelp;
      return Promise.resolve();
    });
  });

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    registerScriptSpy.calls.reset();
    fakeHelp = {
      HelpWidget: {
        disabled: false,
        opened: false,
        close() {
          this.opened = false;
        },
        load(helpConfig: any) {
          // help widget initialized...
        },
        open(helpKey?: string) {
          // help widget open...
          this.opened = true;
        },
        toggleOpen() {
          this.opened ? this.close() : this.open();
        },
        disableWidget() {
          this.opened = false;
          this.disabled = true;
        },
        enableWidget() {
          this.disabled = false;
        },
        ready() {
          return Promise.resolve();
        }
      }
    };

    spyOn(document, 'createElement').and.callFake(mockCreateElement);
    spyOn(document, 'createTextNode').and.callFake(mockCreateTextNode);
    spyOn(document.head, 'appendChild').and.callFake(mockHeadAppendChild);
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    registerScriptSpy.calls.reset();
    BBHelpClient['defaultHelpKey'] = 'default.html';
    BBHelpClient['currentHelpKey'] = undefined;
  });

  it('should add styles to the document head', (done) => {
    expect(headStyles).toEqual('');
    BBHelpClient.addStyles();
    expect(headStyles).toEqual(testCss);
    done();
  });

  it('should load the help widget library', (done) => {
    BBHelpClient
      .load({})
      .then(() => {
        expect(registerScriptSpy.calls.argsFor(0)).toEqual(
          ['https://cdn.blackbaudcloud.com/bb-help/bb-help.js']
        );
        done();
      })
      .catch(() => {
        done.fail('The help widget library was not loaded.');
      });
  });

  it('should initialize the help widget with config', (done) => {
    const helpLoadSpy = spyOn(fakeHelp.HelpWidget, 'load').and.callThrough();
    const config = {
      productId: 'lo'
    };

    BBHelpClient
      .load(config)
      .then(() => {
        expect(fakeHelp.HelpWidget.load).toHaveBeenCalledWith(config);
        done();
      })
      .catch(() => {
        done.fail('The help widget was not configured.');
      });
  });

  it('should handle undefined config', (done) => {
    const defaultConfig = {
      getCurrentHelpKey: BBHelpClient.getCurrentHelpKey
    };

    const helpLoadSpy = spyOn(fakeHelp.HelpWidget, 'load').and.callThrough();

    BBHelpClient
      .load()
      .then(() => {
        expect(fakeHelp.HelpWidget.load).toHaveBeenCalledWith(defaultConfig);
        done();
      })
      .catch(() => {
        done.fail('The help widget does not support undefined config.');
      });
  });

  it('should add the required help widget elements to the page', (done) => {
    BBHelpClient
      .load({
        productId: 'lo'
      })
      .then(() => {
        expect(document.querySelectorAll('#bb-help-widget')).not.toBeNull();
        done();
      })
      .catch(() => {
        done.fail('The help widget elements were not created.');
      });
  });

  it('should return the defaultHelpKey if no currentHelpKey is defined', (done) => {
      const helpKey = BBHelpClient.getCurrentHelpKey();
      expect(helpKey).toEqual('default.html');
      done();
  });

  it('should set the defaultKey to the defaultHelpKey from the config', (done) => {
    BBHelpClient
      .load({
        defaultHelpKey: 'new-default.html',
        productId: 'lo'
      })
      .then(() => {
        const helpKey = BBHelpClient['defaultHelpKey'];
        expect(helpKey).toEqual('new-default.html');
        done();
      })
      .catch(() => {
        done.fail('The help widget elements were not created.');
      });
  });

  it('should set the currentHelpKey to the helpKey passed as a parameter', (done) => {
    const newHelpKey = 'test-key.html';
    const initialHelpKey = BBHelpClient.getCurrentHelpKey();
    BBHelpClient.setCurrentHelpKey(newHelpKey);
    const helpKey = BBHelpClient.getCurrentHelpKey();
    expect(initialHelpKey).toEqual('default.html');
    expect(helpKey).not.toEqual(initialHelpKey);
    expect(helpKey).toEqual(newHelpKey);
    done();
  });

  it('should set the currentHelpKey to defaultHelpKey if no helpKey is passed as a parameter', (done) => {
    BBHelpClient.setCurrentHelpKey();
    const helpKey = BBHelpClient.getCurrentHelpKey();
    expect(helpKey).toEqual('default.html');
    done();
  });

  it('should set the currentHelpKey back to defaultHelpKey when setHelpKeyToDefault is called', (done) => {
    const newHelpKey = 'test-key.html';
    BBHelpClient.setCurrentHelpKey(newHelpKey);
    const helpKey = BBHelpClient.getCurrentHelpKey();
    BBHelpClient.setHelpKeyToDefault();
    const currentHelpKey = BBHelpClient.getCurrentHelpKey();
    expect(helpKey).toEqual(newHelpKey);
    expect(currentHelpKey).toEqual('default.html');
    done();
  });

  it('should open the widget to the currentHelpKey if no helpKey is passed as a parameter', (done) => {
    const helpOpenSpy = spyOn(fakeHelp.HelpWidget, 'open').and.callThrough();
    const ready = spyOn(BBHelpClient, 'ready').and.callFake(() => {
      return Promise.resolve();
    });

    const newHelpKey = 'test-key.html';
    BBHelpClient
      .load()
      .then()
      .then(() => {
        BBHelpClient.setCurrentHelpKey(newHelpKey);
        BBHelpClient.openWidgetToHelpKey();
        expect(helpOpenSpy).toHaveBeenCalledWith(newHelpKey);
        done();
      })
      .catch(() => {
        done.fail('The help widget was not configured.');
      });
  });

  it('should open the widget to a specified helpKey if one is passed as a parameter', (done) => {
    const helpOpenSpy = spyOn(fakeHelp.HelpWidget, 'open').and.callThrough();
    const readySpy = spyOn(BBHelpClient, 'ready').and.callFake(() => {
      return Promise.resolve();
    });
    const newHelpKey = 'test-key.html';
    BBHelpClient
      .load()
      .then(() => {
        BBHelpClient.setCurrentHelpKey(newHelpKey);
        BBHelpClient.openWidgetToHelpKey('foo.html');
        expect(helpOpenSpy).toHaveBeenCalledWith('foo.html');
        done();
      })
      .catch(() => {
        done.fail('The help widget was not configured.');
      });
  });

  it('should open and close the widget', (done) => {
    const helpOpenSpy = spyOn(fakeHelp.HelpWidget, 'open').and.callThrough();
    const helpCloseSpy = spyOn(fakeHelp.HelpWidget, 'close').and.callThrough();
    const readySpy = spyOn(BBHelpClient, 'ready').and.callFake(() => {
      return Promise.resolve();
    });

    BBHelpClient.load()
      .then(() => {
        expect(helpOpenSpy).not.toHaveBeenCalled();
        BBHelpClient.openWidget();
        expect(helpOpenSpy).toHaveBeenCalled();
        expect(fakeHelp.HelpWidget.opened).toBe(true);
        expect(helpCloseSpy).not.toHaveBeenCalled();
        BBHelpClient.closeWidget();
        expect(helpCloseSpy).toHaveBeenCalled();
        expect(fakeHelp.HelpWidget.opened).toBe(false);
        done();
      })
      .catch(() => {
        done.fail('The help widget was not configured.');
      });
  });

  it('should toggle the widget between open and closed', (done) => {
    const helpOpenSpy = spyOn(fakeHelp.HelpWidget, 'open').and.callThrough();
    const helpCloseSpy = spyOn(fakeHelp.HelpWidget, 'close').and.callThrough();
    const helpToggleSpy = spyOn(fakeHelp.HelpWidget, 'toggleOpen').and.callThrough();
    const readySpy = spyOn(BBHelpClient, 'ready').and.callFake(() => {
      return Promise.resolve();
    });

    BBHelpClient.load()
      .then(() => {
        expect(helpOpenSpy).not.toHaveBeenCalled();
        return BBHelpClient.toggleOpen();
      })
      .then(() => {
        expect(helpOpenSpy).toHaveBeenCalled();
        expect(helpCloseSpy).not.toHaveBeenCalled();
        return BBHelpClient.toggleOpen();
      })
      .then(() => {
        expect(helpCloseSpy).toHaveBeenCalled();
        expect(helpToggleSpy).toHaveBeenCalledTimes(2);
        done();
      })
      .catch(() => {
        done.fail('The help widget was not configured.');
      });
  });

  it('should disable and enable the widget', (done) => {
    const helpDisableSpy = spyOn(fakeHelp.HelpWidget, 'disableWidget').and.callThrough();
    const helpEnableSpy = spyOn(fakeHelp.HelpWidget, 'enableWidget').and.callThrough();
    const helpOpenSpy = spyOn(fakeHelp.HelpWidget, 'open').and.callThrough();
    const readySpy = spyOn(BBHelpClient, 'ready').and.callFake(() => {
      return Promise.resolve();
    });

    BBHelpClient.load()
      .then(() => {
        expect(helpDisableSpy).not.toHaveBeenCalled();
        return BBHelpClient.openWidget();
      })
      .then(() => {
        expect(fakeHelp.HelpWidget.opened).toBe(true);
        return BBHelpClient.disableWidget();
      })
      .then(() => {
        expect(fakeHelp.HelpWidget.disabled).toBe(true);
        return BBHelpClient.enableWidget();
      })
      .then(() => {
        expect(helpEnableSpy).toHaveBeenCalled();
        expect(fakeHelp.HelpWidget.disabled).toBe(false);
        done();
      })
      .catch(() => {
        done.fail('The help widget was not configured.');
      });
  });

  it('should close the widget on disabled', (done) => {
    const helpDisableSpy = spyOn(fakeHelp.HelpWidget, 'disableWidget').and.callThrough();
    const helpEnableSpy = spyOn(fakeHelp.HelpWidget, 'enableWidget').and.callThrough();
    const helpOpenSpy = spyOn(fakeHelp.HelpWidget, 'open').and.callThrough();
    const readySpy = spyOn(BBHelpClient, 'ready').and.callFake(() => {
      return Promise.resolve();
    });

    BBHelpClient.load()
      .then(() => {
        expect(helpDisableSpy).not.toHaveBeenCalled();
        return BBHelpClient.openWidget();
      })
      .then(() => {
        expect(fakeHelp.HelpWidget.opened).toBe(true);
        return BBHelpClient.disableWidget();
      })
      .then(() => {
        expect(helpDisableSpy).toHaveBeenCalled();
        expect(fakeHelp.HelpWidget.opened).toBe(false);
        expect(fakeHelp.HelpWidget.disabled).toBe(true);
        done();
      })
      .catch(() => {
        done.fail('The help widget was not configured.');
      });
  });

  it('should resolve as ready when the load method has completed.', (done) => {
    const readySpy = spyOn(BBHelpClient, 'ready').and.callThrough();
    BBHelpClient.load()
      .then(() => {
        return BBHelpClient.ready();
      })
      .then(() => {
        expect(readySpy).toHaveBeenCalled();
        done();
      });
  });

  it('should log an error if the HelpWidget ready method fails', (done) => {
    const errMessage = 'The Help Widget failed to load.';
    const consoleSpy = spyOn(console, 'error').and.callThrough();
    const widgetSpy = spyOn(fakeHelp.HelpWidget, 'ready').and.callFake(() => {
      return Promise.reject(errMessage);
    });
    BBHelpClient.load()
      .then(() => {
        return BBHelpClient.ready();
      })
      .then(() => {
        expect(widgetSpy).toHaveBeenCalled();
        expect(errMessage).toBe('The Help Widget failed to load.');
        expect(consoleSpy).toHaveBeenCalledWith(errMessage);
        done();
      });
  });

  it('should err if the widget doesn\'t load before maxIterations are reached', (done) => {
    const errMessage = 'The Help Widget failed to load.';
    const consoleSpy = spyOn(console, 'error').and.callThrough();
    BBHelpClient['widgetLoaded'] = false;
    BBHelpClient.ready()
      .then(() => {
        expect(consoleSpy).toHaveBeenCalledWith('The Help Widget failed to load.');
        done();
      });
  });
});
