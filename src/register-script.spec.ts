import { } from 'jasmine';

import { registerScript } from './register-script';

describe('registerScript', () => {
  it('should create a script tag with a given source', (done) => {
    const scriptSrc = 'http://localhost/';
    const appendChildSpy = spyOn(
      document.body, 'appendChild'
    ).and.callFake((el: any) => {
      el.onload();
    });

    registerScript(scriptSrc)
      .then(() => {
        expect(appendChildSpy).toHaveBeenCalledWith(
          jasmine.objectContaining({ src: scriptSrc })
        );
        done();
      })
      .catch(() => {
        done.fail('The script tag was not created.');
      });
  });

  it('should handle scripts that fail to load', (done) => {
    const appendChildSpy = spyOn(
      document.body,
      'appendChild'
    ).and.callFake((el: any) => {
      el.onerror();
    });

    registerScript('https://example.com/')
      .then(() => {
        done.fail('Calling onerror should have caused the promise to fail.');
      })
      .catch(() => {
        done();
      });
  });
});
