import { BBHelpHelpWidget } from './help-widget';
import { BBHelpHelpWidgetRenderer } from './help-widget-renderer';
import { MockStyleUtility } from './mocks/mock-style-utilty';
import { OBJECT_COMPARE_MATCHERS } from './mocks/object.compare.matcher';
import { CONFIG_STORE, VALID_CONFIG_ID } from './service/config-store';

describe('BBHelpHelpWidget', () => {
  let helpWidget: BBHelpHelpWidget;
  let mockWidgetRenderer: any;
  let mockStyleUtility: any;
  let windowSpy: jasmine.Spy;

  beforeAll(() => {
    jasmine.addMatchers(OBJECT_COMPARE_MATCHERS);
  });

  beforeEach(() => {
    windowSpy = spyOn(window, 'open').and.callFake(() => {
    });
    mockWidgetRenderer = new BBHelpHelpWidgetRenderer();
    mockStyleUtility = new MockStyleUtility();
    helpWidget = new BBHelpHelpWidget(mockWidgetRenderer, mockStyleUtility);
    helpWidget.init();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should unload widget', (done: DoneFn) => {
    // Remove the original container that was added during beforeEach as a side effect.
    // This is a hack in order to avoid restructuring this whole file
    // which misguidedly relies on that beforeEach
    document.getElementById('bb-help-container').remove();
    const removeEventListener = spyOn(window, 'removeEventListener').and.callFake(() => {
    });
    const addEventListener = spyOn(window, 'addEventListener').and.callFake(() => {
    });
    const config = { onHelpLoaded: jasmine.createSpy('onHelpLoaded') };
    helpWidget.load(config)
      .then(() => {
        expect(addEventListener).toHaveBeenCalledWith('resize', jasmine.any(Function));
        expect(addEventListener).toHaveBeenCalledTimes(1);
        helpWidget.unload();
        expect(helpWidget.onHelpLoaded).toBeUndefined();
        expect(document.getElementById('bb-help-invoker')).toBeNull();
        expect(document.getElementById('bb-help-container')).toBeNull();
        expect(helpWidget.currentHelpKey).toBeUndefined();
        expect(helpWidget.config).toBeUndefined();
        expect(removeEventListener).toHaveBeenCalledWith('resize', jasmine.any(Function));
        expect(removeEventListener).toHaveBeenCalledTimes(1);
        addEventListener.calls.reset();
        removeEventListener.calls.reset();
        return helpWidget.load(config);
      })
      .then(() => {
        expect(helpWidget.onHelpLoaded).toBeDefined();
        expect(document.getElementById('bb-help-invoker')).not.toBeNull();
        expect(document.getElementById('bb-help-container')).not.toBeNull();
        helpWidget.setCurrentHelpKey('foo.html');
        expect(helpWidget.currentHelpKey).toEqual('foo.html');
        expect(helpWidget.config).toBeDefined();
        expect(addEventListener).toHaveBeenCalledWith('resize', jasmine.any(Function));
        expect(addEventListener).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should call the createContainer method on the renderer', (done: DoneFn) => {
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

  it('should call the createInvoker method on the renderer', (done: DoneFn) => {
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
    const createContainer = spyOn(mockWidgetRenderer, 'createContainer').and.callThrough();
    const fakeConfig = { extends: 'test-config' };

    helpWidget.load(fakeConfig)
      .then(() => helpWidget.load(fakeConfig))
      .then(() => {
        expect(createContainer).toHaveBeenCalledTimes(1);
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
        expect(document.activeElement.id).toEqual('bb-help-invoker');
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/topic.html', '_blank');
        done();
      });
  });

  it('should open the help widget with given help key', (done: DoneFn) => {
    helpWidget.load({ helpBaseUrl: 'https://bb.com' })
      .then(() => {
        helpWidget.open('topic.html');
        expect(document.activeElement.id).toEqual('bb-help-invoker');
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/topic.html', '_blank');
        done();
      });
  });

  it('should not open the help widget if the widget is disabled', (done: DoneFn) => {
    helpWidget.load({ helpBaseUrl: 'https://bb.com' })
      .then(() => {
        helpWidget.disableWidget();
        helpWidget.open('topic.html');
        expect(document.activeElement.id).not.toEqual('bb-help-invoker');
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

  it('should hide/show menu when invoker is clicked', (done: DoneFn) => {
    helpWidget.load({ helpBaseUrl: 'https://bb.com' })
      .then(() => {
        const menu = document.querySelector('div.help-menu');
        const invoker = document.getElementById('bb-help-invoker');
        expect(menu.classList).toContain('help-menu-collapse');
        expect(invoker).not.toContain('active');
        invoker.click();
        expect(menu.classList).not.toContain('help-menu-collapse');
        expect(invoker.classList).toContain('active');
        expect(menu.firstElementChild).toBe(document.activeElement);
        invoker.click();
        expect(menu.classList).toContain('help-menu-collapse');
        expect(invoker).not.toContain('active');
        done();
      });
  });

  ['arrowdown', 'arrowright', 'down', 'right'].forEach(key => {
    it(`should open menu and focus on first item when ${key} key is pressed`, (done: DoneFn) => {
      helpWidget.load({})
        .then(() => {
          const menu = document.querySelector('div.help-menu');
          const invoker = document.getElementById('bb-help-invoker');
          invoker.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
          expect(menu.classList).not.toContain('help-menu-collapse');
          expect(invoker.classList).toContain('active');
          expect(document.activeElement).toBe(menu.firstElementChild);
          done();
        });
    });
  });

  ['arrowup', 'arrowleft', 'up', 'left'].forEach(key => {
    it(`should open menu and focus on last item when ${key} key is pressed`, (done: DoneFn) => {
      helpWidget.load({})
        .then(() => {
          const menu = document.querySelector('div.help-menu');
          const invoker = document.getElementById('bb-help-invoker');
          invoker.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
          expect(menu.classList).not.toContain('help-menu-collapse');
          expect(invoker.classList).toContain('active');
          expect(document.activeElement).toBe(menu.lastElementChild);
          done();
        });
    });
  });

  describe('when menu is shown', () => {
    beforeEach(async () => {
      const appButton = document.createElement('button');
      appButton.appendChild(document.createTextNode('App content'));
      appButton.id = 'app-button';
      document.body.appendChild(appButton);
      await helpWidget.load({ helpBaseUrl: 'https://bb.com' })
        .then(() => document.getElementById('bb-help-invoker').click());
    });

    it('should hide menu when invoker is clicked', () => {
      const invoker = document.getElementById('bb-help-invoker');
      invoker.click();
      const menu = document.querySelector('div.help-menu');
      expect(menu.classList).toContain('help-menu-collapse');
      expect(invoker).not.toContain('active');
    });

    it('should hide menu when something outside container is focused', () => {
      const invoker = document.getElementById('bb-help-invoker');
      const menu = document.querySelector('div.help-menu');
      const button = document.querySelector('button#app-button');
      menu.dispatchEvent(new FocusEvent('focusout', { relatedTarget: button }));
      expect(menu.classList).toContain('help-menu-collapse');
      expect(invoker).not.toContain('active');
    });

    it('should not hide menu when something inside container is focused', () => {
      const menu = document.querySelector('div.help-menu');
      const invoker = document.getElementById('bb-help-invoker');
      menu.dispatchEvent(new FocusEvent('focusout', { relatedTarget: invoker }));
      expect(menu.classList).not.toContain('help-menu-collapse');
      expect(invoker.classList).toContain('active');
    });

    it('should ignore unknown keyboard keys', () => {
      const menu = document.querySelector('div.help-menu');
      const invoker = document.getElementById('bb-help-invoker');
      menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      expect(menu.classList).not.toContain('help-menu-collapse');
      expect(invoker.classList).toContain('active');
      expect(document.activeElement).toBe(menu.firstElementChild);
    });

    ['escape', 'esc', 'tab'].forEach(key => {
      it(`should hide menu when ${key} key is pressed`, () => {
        const menu = document.querySelector('div.help-menu');
        const invoker = document.getElementById('bb-help-invoker');
        menu.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
        expect(menu.classList).toContain('help-menu-collapse');
        expect(invoker).not.toContain('active');
        expect(document.activeElement).toBe(invoker);
      });
    });

    ['arrowdown', 'arrowright', 'down', 'right'].forEach(key => {
      it(`should focus on next item when ${key} key is pressed`, () => {
        const menu = document.querySelector('div.help-menu');
        const invoker = document.getElementById('bb-help-invoker');
        menu.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
        expect(menu.classList).not.toContain('help-menu-collapse');
        expect(invoker.classList).toContain('active');
        expect(document.activeElement).toBe(menu.firstElementChild.nextElementSibling);
      });
    });

    ['arrowup', 'arrowleft', 'up', 'left'].forEach(key => {
      it(`should focus on previous item when ${key} key is pressed`, () => {
        const menu = document.querySelector('div.help-menu');
        const invoker = document.getElementById('bb-help-invoker');
        // focus on the second one for the test so we can assert it goes back to the first
        (menu.firstElementChild.nextElementSibling as HTMLElement).focus();
        menu.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
        expect(menu.classList).not.toContain('help-menu-collapse');
        expect(invoker.classList).toContain('active');
        expect(document.activeElement).toBe(menu.firstElementChild);
      });
    });

    describe('when focused on first element', () => {
      beforeEach(() => {
        const menu = document.querySelector('div.help-menu');
        (menu.firstElementChild as HTMLElement).focus();
      });

      ['arrowup', 'arrowleft', 'up', 'left'].forEach(key => {
        it(`should wrap focus to last item when ${key} key is pressed`, () => {
          const menu = document.querySelector('div.help-menu');
          const invoker = document.getElementById('bb-help-invoker');
          menu.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
          expect(menu.classList).not.toContain('help-menu-collapse');
          expect(invoker.classList).toContain('active');
          expect(document.activeElement).toBe(menu.lastElementChild);
        });
      });
    });

    describe('when focused on last element', () => {
      beforeEach(() => {
        const menu = document.querySelector('div.help-menu');
        (menu.lastElementChild as HTMLElement).focus();
      });

      ['arrowdown', 'arrowright', 'down', 'right'].forEach(key => {
        it(`should wrap focus to first item when ${key} key is pressed`, () => {
          const menu = document.querySelector('div.help-menu');
          const invoker = document.getElementById('bb-help-invoker');
          menu.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
          expect(menu.classList).not.toContain('help-menu-collapse');
          expect(invoker.classList).toContain('active');
          expect(document.activeElement).toBe(menu.firstElementChild);
        });
      });
    });

    describe('when focused on element before separator', () => {
      let separator: HTMLDivElement;

      beforeEach(() => {
        separator = document.querySelector('div.help-menu-separator');
        (separator.previousElementSibling as HTMLElement).focus();
      });

      it('should skip separator when user cycles to next item', () => {
        const menu = document.querySelector('div.help-menu');
        menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'down' }));
        expect(document.activeElement).toBe(separator.nextElementSibling);
      });
    });

    describe('when focused on element after separator', () => {
      let separator: HTMLDivElement;

      beforeEach(() => {
        separator = document.querySelector('div.help-menu-separator');
        (separator.nextElementSibling as HTMLElement).focus();
      });

      it('should skip separator when user cycles to previous item', () => {
        const menu = document.querySelector('div.help-menu');
        menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'up' }));
        expect(document.activeElement).toBe(separator.previousElementSibling);
      });
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

  it('should set and send widget currentHelpKey to help SPA', () => {
    const testKey = 'help.html';
    helpWidget.setCurrentHelpKey(testKey);
    expect(helpWidget.currentHelpKey).toEqual(testKey);
  });

  it('should set the helpKey to the defaultHelpKey if no helpKey is passed to setCurrentHelpKey', (done: DoneFn) => {
    const config = { defaultHelpKey: 'test.default' };
    helpWidget.load(config)
      .then(() => {
        helpWidget.setCurrentHelpKey();
        expect(helpWidget.currentHelpKey).toEqual(config.defaultHelpKey);
        done();
      });
  });

  it('should set the help key to the default help key', (done: DoneFn) => {
    const config = { defaultHelpKey: 'test.default' };
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

  it('should add the mobile container class when the window screen width is SCREEN_XS_MAX and below ', () => {
    (window as any).innerWidth = 767;
    window.dispatchEvent(new Event('resize'));
    const container: HTMLElement = document.getElementById('bb-help-container');
    expect(container.classList).toContain('bb-help-container-mobile');
  });

  it('should add the mobile width invoker class when screen is below mobile width', (done: DoneFn) => {
    helpWidget.load({})
      .then(() => {
        (window as any).innerWidth = 700;
        (window as any).innerHeight = 1000;
        window.dispatchEvent(new Event('resize'));
        const invoker: HTMLElement = document.getElementById('bb-help-invoker');
        expect(invoker.classList).toContain('bb-help-mobile-width');
        done();
      });
  });

  it('should not add the mobile width invoker class when screen is above mobile width', (done: DoneFn) => {
    helpWidget.load({})
      .then(() => {
        (window as any).innerWidth = 1000;
        (window as any).innerHeight = 400;
        window.dispatchEvent(new Event('resize'));
        const invoker: HTMLElement = document.getElementById('bb-help-invoker');
        expect(invoker.classList).not.toContain('bb-help-mobile-width');
        done();
      });
  });

  it('should update the container classes on window resize', (done: DoneFn) => {
    (window as any).innerWidth = 1000;
    (window as any).innerHeight = 1000;
    window.dispatchEvent(new Event('resize'));
    const container: HTMLElement = document.getElementById('bb-help-container');
    expect(container.classList).not.toContain('bb-help-container-mobile');
    (window as any).innerHeight = 400;
    window.dispatchEvent(new Event('resize'));
    expect(container.classList).toContain('bb-help-container-mobile');
    done();
  });
});
