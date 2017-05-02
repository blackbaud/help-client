import { } from 'jasmine';

import { BBHelp } from './help';
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
        }
      }
    };
  });

  afterEach(() => {
    registerScriptSpy.calls.reset();
  });

  it('should load the help widget library', (done) => {
    BBHelp
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

    BBHelp
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
    const helpLoadSpy = spyOn(fakeHelp.HelpWidget, 'load').and.callThrough();

    BBHelp
      .load()
      .then(() => {
        expect(fakeHelp.HelpWidget.load).toHaveBeenCalledWith({});
        done();
      })
      .catch(() => {
        done.fail('The help widget does not support undefined config.');
      });
  });

  it('should add the required help widget elements to the page', (done) => {
    BBHelp
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
});
