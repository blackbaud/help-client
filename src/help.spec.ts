import { } from 'jasmine';

import { BBHelpClient } from './help';
import * as utils from './register-script';

describe('help-client', () => {
  let registerScriptSpy: jasmine.Spy;
  let fakeHelp: any;

  beforeAll(() => {
    registerScriptSpy = spyOn(
      utils, 'registerScript'
    ).and.callFake(() => {
      (window as any).BBHELP = fakeHelp;
      return Promise.resolve();
    });
  });

  beforeEach(() => {
    registerScriptSpy.calls.reset();
    fakeHelp = {
      HelpWidget: {
        load: (helpConfig: any) => {
          // help widget initialized...
        },
        open: (helpKey: string) => {
          // help widget open...
        }
      }
    };
  });

  afterEach(() => {
    registerScriptSpy.calls.reset();
    BBHelpClient['defaultHelpKey'] = 'default.html';
    BBHelpClient['currentHelpKey'] = undefined;
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
    const newHelpKey = 'test-key.html';
    BBHelpClient
      .load()
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
});
