import { BBHelpHelpWidget } from './help-widget';
import { OBJECT_COMPARE_MATCHERS } from './mocks/object.compare.matcher';
import { CONFIG_STORE, VALID_CONFIG_ID } from './service/config-store';

describe('BBHelpHelpWidget', () => {
  let helpWidget: BBHelpHelpWidget;
  let windowSpy: jasmine.Spy;

  beforeAll(() => {
    jasmine.addMatchers(OBJECT_COMPARE_MATCHERS);
  });

  beforeEach(() => {
    windowSpy = spyOn(window, 'open').and.callFake(() => {
    });
    helpWidget = new BBHelpHelpWidget();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should unload widget', (done: DoneFn) => {
    const config = { onHelpLoaded: jasmine.createSpy('onHelpLoaded') };
    helpWidget.load(config)
      .then(() => {
        helpWidget.unload();
        expect(helpWidget.onHelpLoaded).toBeUndefined();
        expect(helpWidget.currentHelpKey).toBeUndefined();
        expect(helpWidget.config).toBeUndefined();
        return helpWidget.load(config);
      })
      .then(() => {
        expect(helpWidget.onHelpLoaded).toBeDefined();
        helpWidget.setCurrentHelpKey('foo.html');
        expect(helpWidget.currentHelpKey).toEqual('foo.html');
        expect(helpWidget.config).toBeDefined();
        done();
      });
  });

  it('should load from a config', (done: DoneFn) => {
    const givenConfig = { extends: 'renxt' };
    const storedConfig = CONFIG_STORE[givenConfig.extends as VALID_CONFIG_ID];
    helpWidget.load(givenConfig)
      .then(() => {
        expect(helpWidget.config).toEqualObject(givenConfig, { includes: ['extends'] });
        expect(helpWidget.config)
          .toEqualObject(storedConfig, { excludes: ['extends', 'locale', 'helpBaseUrl', 'hostQueryParams'] });
        done();
      });
  });

  it('should not load from a config if load has been called already', (done: DoneFn) => {
    const onHelpLoadedSpy = jasmine.createSpy('onHelpLoadedSpy');
    const fakeConfig = { extends: 'test-config', onHelpLoaded:  onHelpLoadedSpy};

    helpWidget.load(fakeConfig)
      .then(() => helpWidget.load(fakeConfig))
      .then(() => {
        expect(onHelpLoadedSpy).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should set the defaultHelpKey if one exits on the config', (done: DoneFn) => {
    const fakeConfig = { defaultHelpKey: 'new-default.html' };

    helpWidget.load(fakeConfig)
      .then(() => {
        helpWidget.setHelpKeyToDefault();
        expect(helpWidget.currentHelpKey).toBe(fakeConfig.defaultHelpKey);
        done();
      });
  });

  // TODO move to mergeConfig
  it('should set the hostQueryParams on the config to the queryParams from the window', (done: DoneFn) => {
    const location: Location = { search: '?foo=bar' } as unknown as Location;
    helpWidget.load({}, location)
      .then(() => {
        expect(helpWidget.config.hostQueryParams).toEqual('?foo=bar');
        done();
      });
  });

  it('should open the help widget when not given help key', (done: DoneFn) => {
    helpWidget.load({ helpBaseUrl: 'https://bb.com' })
      .then(() => {
        helpWidget.setCurrentHelpKey('topic.html');
        helpWidget.open();
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/topic.html', '_blank');
        done();
      });
  });

  it('should open the help widget with given help key', (done: DoneFn) => {
    helpWidget.load({ helpBaseUrl: 'https://bb.com' })
      .then(() => {
        helpWidget.open('topic.html');
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/topic.html', '_blank');
        done();
      });
  });

  it('should not open the help widget if the widget is disabled', (done: DoneFn) => {
    helpWidget.load({ helpBaseUrl: 'https://bb.com' })
      .then(() => {
        helpWidget.disableWidget();
        helpWidget.open('topic.html');
        expect(windowSpy).not.toHaveBeenCalledWith('https://bb.com/topic.html', '_blank');
        done();
      });
  });

  it('should not throw error on close', (done: DoneFn) => {
    helpWidget.load({})
      .then(() => {
        helpWidget.close();
        done();
      });
  });

  it('should pass a helpKey to the open method from toggleOpen', (done: DoneFn) => {
    helpWidget.load({ helpBaseUrl: 'https://bb.com' })
      .then(() => {
        const testHelpKey = 'test-key.html';
        helpWidget.toggleOpen(testHelpKey);
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/test-key.html', '_blank');
        done();
      });
  });

  it('should call helpUpdateCallback when setting current help key', (done: DoneFn) => {
    const helpUpdateCallbackSpy = jasmine.createSpy('helpUpdateCallback');
    const config = { helpBaseUrl: 'https://bb.com', helpUpdateCallback: helpUpdateCallbackSpy };
    helpWidget.load(config)
      .then(() => {
        const testKey = 'help.html';
        helpWidget.setCurrentHelpKey(testKey);
        expect(helpWidget.currentHelpKey).toEqual(testKey);
        expect(helpUpdateCallbackSpy).toHaveBeenCalledTimes(1);
        expect(helpUpdateCallbackSpy).toHaveBeenCalledWith({ url: `${config.helpBaseUrl}/${testKey}` });
        done();
      });
  });

  it('should set and send widget currentHelpKey to help SPA', (done: DoneFn) => {
    const config = { helpBaseUrl: 'https://bb.com' };
    helpWidget.load(config)
      .then(() => {
        const testKey = 'help.html';
        helpWidget.setCurrentHelpKey(testKey);
        expect(helpWidget.currentHelpKey).toEqual(testKey);
        done();
      });
  });

  it('should set the helpKey to the defaultHelpKey if no helpKey is passed to setCurrentHelpKey', (done: DoneFn) => {
    const config = { defaultHelpKey: 'test.default', helpBaseUrl: 'https://bb.com' };
    helpWidget.load(config)
      .then(() => {
        helpWidget.setCurrentHelpKey();
        expect(helpWidget.currentHelpKey).toEqual(config.defaultHelpKey);
        done();
      });
  });

  it('should set the help key to the default help key', (done: DoneFn) => {
    const config = { defaultHelpKey: 'test.default', helpBaseUrl: 'https://bb.com' };
    helpWidget.load(config)
      .then(() => {
        helpWidget.setHelpKeyToDefault();
        expect(helpWidget.currentHelpKey).toEqual(config.defaultHelpKey);
        done();
      });
  });

  it('should return the current help key from the getHelpKey method', (done: DoneFn) => {
    const testKey = 'test-key.html';
    const config = { defaultHelpKey: 'test.default', helpBaseUrl: 'https://bb.com' };
    helpWidget.load(config)
      .then(() => {
        helpWidget.setCurrentHelpKey(testKey);
        helpWidget.open();
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/test-key.html', '_blank');
        done();
      });
  });

  it('should return the default help key from the getHelpKey method if no currentHelpKey exists', (done: DoneFn) => {
    const config = { defaultHelpKey: 'test.default', helpBaseUrl: 'https://bb.com' };
    helpWidget.load(config)
      .then(() => {
        helpWidget.open();
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/test.default', '_blank');
        done();
      });
  });

  it('should override its getCurrentHelpKey variable with one from the config (string value)', (done: DoneFn) => {
    const config = { getCurrentHelpKey: 'test.html', helpBaseUrl: 'https://bb.com' };
    helpWidget.load(config)
      .then(() => {
        helpWidget.open();
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/test.html', '_blank');
        done();
      });
  });

  it('should override its getCurrentHelpKey variable with one from the config (function value)', (done: DoneFn) => {
    const config = { getCurrentHelpKey: () => 'test.html', helpBaseUrl: 'https://bb.com' };
    helpWidget.load(config)
      .then(() => {
        helpWidget.open();
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/test.html', '_blank');
        done();
      });
  });

  it('should override its onHelpLoaded variable with one from the config (function value)', (done: DoneFn) => {
    const config = { onHelpLoaded: jasmine.createSpy('onHelpLoaded') };
    helpWidget.load(config)
      .then(() => {
        expect(config.onHelpLoaded).toHaveBeenCalled();
        done();
      });
  });

  it('should enable/disable the help widget', (done: DoneFn) => {
    const config = { helpBaseUrl: 'https://bb.com' };
    helpWidget.load(config)
      .then(() => {
        helpWidget.disableWidget();
        helpWidget.open();
        expect(windowSpy).not.toHaveBeenCalled();
        windowSpy.calls.reset();
        helpWidget.enableWidget();
        helpWidget.open();
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/default.html', '_blank');
        done();
      });
  });

  it('should assess what\'s new revision and return revision number', (done: DoneFn) => {
    const fakeConfig = { productId: 'rex', whatsNewRevisions: 'rex=30;' };
    helpWidget.load(fakeConfig)
      .then(() => {
        expect(helpWidget.getWhatsNewRevision()).toEqual(30);
        done();
      });
  });

  it('should assess what\'s new revision and return revision number from several revisions', (done: DoneFn) => {
    const fakeConfig = { productId: 'fe', whatsNewRevisions: 'rex=30;fe=10;lo=15' };
    helpWidget.load(fakeConfig)
      .then(() => {
        expect(helpWidget.getWhatsNewRevision()).toEqual(10);
        done();
      });
  });

  it('should assess what\'s new revision with no found revision and return 0', (done: DoneFn) => {
    const fakeConfig = { productId: 'fe', whatsNewRevisions: 'rex=30;' };
    helpWidget.load(fakeConfig)
      .then(() => {
        expect(helpWidget.getWhatsNewRevision()).toEqual(0);
        done();
      });
  });

  it('should assess what\'s new revision with undefined whatsNewRevisions property and return 0', (done: DoneFn) => {
    const fakeConfig = { productId: 'rex' };
    helpWidget.load(fakeConfig)
      .then(() => {
        expect(helpWidget.getWhatsNewRevision()).toEqual(0);
        done();
      });
  });
});
