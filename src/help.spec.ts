import { BBHelpClient } from './help';

describe('BBHelpClient', () => {
  let mockHelpWidget: any;

  class MockHelpWidget {
    public close() {
      return;
    }

    public load(helpConfig?: any) {
      return;
    }

    public open(helpKey?: string) {
      return;
    }

    public toggleOpen() {
      return;
    }

    public disableWidget() {
      return;
    }

    public enableWidget() {
     return;
    }

    public ready() {
      return Promise.resolve();
    }

    public setHelpKeyToDefault() {
      return;
    }

    public setCurrentHelpKey() {
      return;
    }

    public getCurrentHelpKey() {
      return;
    }

    public getWhatsNewRevision() {
      return;
    }
  }

  beforeEach(() => {
    mockHelpWidget = new MockHelpWidget();

    (window as any).BBHELP = {
      HelpWidget: mockHelpWidget
    };
  });

  it('should pass the config to the Help Widget if the Help Widget is ready', (done) => {
    const helpLoadSpy = spyOn(mockHelpWidget, 'load').and.callThrough();
    const helpReady = spyOn(mockHelpWidget, 'ready').and.callThrough();
    const config = {
      productId: 'lo'
    };

    BBHelpClient
      .load(config)
      .then(() => {
        expect(helpReady).toHaveBeenCalled();
        expect(helpLoadSpy).toHaveBeenCalledWith(config);
        done();
      })
      .catch(() => {
        done.fail('The help widget was not configured.');
      });
  });

  it('should not pass the config to the Help Widget if the Help Widget is not ready', (done) => {
    const helpLoadSpy = spyOn(mockHelpWidget, 'load').and.callThrough();
    const helpReady = spyOn(mockHelpWidget, 'ready').and.returnValue(Promise.reject('error message'));
    const config = {
      productId: 'lo'
    };

    BBHelpClient
      .load(config)
      .then(() => {
        done();
      })
      .catch(() => {
        expect(helpReady).toHaveBeenCalled();
        expect(helpLoadSpy).not.toHaveBeenCalledWith(config);
        done();
      });
  });

  it('should assign {} to config if none is passed in', (done) => {
    const helpLoadSpy = spyOn(mockHelpWidget, 'load').and.callThrough();
    BBHelpClient
      .load()
      .then(() => {
        expect(helpLoadSpy).toHaveBeenCalledWith({});
        done();
      })
      .catch(() => {
        done.fail('The help widget was not configured.');
      });
  });

  it('should return ready when the Widget is ready', (done) => {
    const helpReady = spyOn(mockHelpWidget, 'ready').and.callThrough();
    BBHelpClient
      .ready()
      .then(() => {
        expect(helpReady).toHaveBeenCalled();
        done();
      })
      .catch(() => {
        done.fail('The help widget elements were not created.');
      });
  });

  it('should log an error if the Widget is never ready', (done) => {
    const helpReady = spyOn(mockHelpWidget, 'ready').and.returnValue(Promise.reject('error message'));
    const consoleSpy = spyOn(window.console, 'error').and.callFake(() => { return; });
    BBHelpClient
      .ready()
      .then(() => {
        done();
      })
      .catch(() => {
        expect(helpReady).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('error message');
        done.fail('The help widget elements were not created.');
      });
  });

  it('should call the setCurrentHelpKey on the widget when setCurrentHelpKey is called', (done) => {
    const helpOpenSpy = spyOn(mockHelpWidget, 'setCurrentHelpKey').and.callThrough();
    const newHelpKey = 'test-key.html';

    BBHelpClient.setCurrentHelpKey(newHelpKey);
    expect(helpOpenSpy).toHaveBeenCalledWith(newHelpKey);
    done();
  });

  it('should call the setHelpKeyToDefault on the widget when setHelpKeyToDefault is called', (done) => {
    const helpDefaultKeySpy = spyOn(mockHelpWidget, 'setHelpKeyToDefault').and.callThrough();

    BBHelpClient.setHelpKeyToDefault();
    expect(helpDefaultKeySpy).toHaveBeenCalled();
    done();
  });

  it('should open the widget to a specified helpKey with openWidgetToHelpKey', (done) => {
    const helpOpenSpy = spyOn(mockHelpWidget, 'open').and.callThrough();

    const newHelpKey = 'test-key.html';

    BBHelpClient.openWidgetToHelpKey(newHelpKey);
    expect(helpOpenSpy).toHaveBeenCalledWith(newHelpKey);
    done();
  });

  it('should open the widget to a specified helpKey with openWidget', (done) => {
    const helpOpenSpy = spyOn(mockHelpWidget, 'open').and.callThrough();
    const newHelpKey = 'test-key.html';
    BBHelpClient.openWidget(newHelpKey);
    expect(helpOpenSpy).toHaveBeenCalledWith(newHelpKey);
    done();
  });

  it('should open the widget to a without a helpKey with openWidget', (done) => {
    const helpOpenSpy = spyOn(mockHelpWidget, 'open').and.callThrough();

    BBHelpClient.openWidget();
    expect(helpOpenSpy).toHaveBeenCalledWith(undefined);
    done();
  });

  it('should call toggleOpen on the HelpWidget with toggleOpen', (done) => {
    const helpToggleOpenSpy = spyOn(mockHelpWidget, 'toggleOpen').and.callThrough();

    BBHelpClient.toggleOpen();
    expect(helpToggleOpenSpy).toHaveBeenCalled();
    done();
  });

  it('should close the widget with closeWidget', (done) => {
    const helpCloseSpy = spyOn(mockHelpWidget, 'close').and.callThrough();

    BBHelpClient.closeWidget();
    expect(helpCloseSpy).toHaveBeenCalled();
    done();
  });

  it('should disable the widget with disableWidget', (done) => {
    const helpDisableSpy = spyOn(mockHelpWidget, 'disableWidget').and.callThrough();

    BBHelpClient.disableWidget();
    expect(helpDisableSpy).toHaveBeenCalled();
    done();
  });

  it('should enable the widget with enableWidget', (done) => {
    const helpEnableSpy = spyOn(mockHelpWidget, 'enableWidget').and.callThrough();

    BBHelpClient.enableWidget();
    expect(helpEnableSpy).toHaveBeenCalled();
    done();
  });

  it('should resolve what\'s new revisions', (done) => {
    const helpWhatsNewSpy = spyOn(mockHelpWidget, 'getWhatsNewRevision').and.callThrough();
    BBHelpClient.getWhatsNewRevision();
    expect(helpWhatsNewSpy).toHaveBeenCalled();
    done();
  });
});
