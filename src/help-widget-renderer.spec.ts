import { BBHelpHelpWidgetRenderer } from './help-widget-renderer';

const BB_HELP_HIDE_ON_MOBILE_CLASS: string = 'bb-help-hide-on-mobile';

describe('BBHelpHelpWidgetRenderer', () => {
  let widgetRenderer: BBHelpHelpWidgetRenderer;

  beforeEach(() => {
    widgetRenderer = new BBHelpHelpWidgetRenderer();
  });

  it('should create the help container', (done) => {
    const containerEl: HTMLElement = widgetRenderer.createContainer();
    expect(containerEl).toBeDefined();
    expect(containerEl.classList).toContain('bb-help-container');
    expect(containerEl.id).toEqual('bb-help-container');
    done();
  });

  it('should create the invoker', (done) => {
    const invokerEl: HTMLButtonElement = widgetRenderer.createInvoker();
    expect(invokerEl).toBeDefined();
    expect(invokerEl.id).toEqual('bb-help-invoker');
    done();
  });

  it('should create the iframe', (done) => {
    const iframeEl: HTMLIFrameElement = widgetRenderer.createIframe();
    expect(iframeEl).toBeDefined();
    expect(iframeEl.id).toEqual('bb-help-iframe');
    expect(iframeEl.src).toEqual('https://host.nxt.blackbaud.com/bb-help/');
    done();
  });

  it('should add styles to the invoker based on config', (done) => {
    const invokerEl: HTMLButtonElement = widgetRenderer.createInvoker();
    const headerConfig = {
      headerColor: 'red',
      headerTextColor: 'blue'
    };

    widgetRenderer.addInvokerStyles(invokerEl, headerConfig);
    expect(invokerEl.style.backgroundColor).toEqual(headerConfig.headerColor);
    expect(invokerEl.style.color).toEqual(headerConfig.headerTextColor);
    expect(invokerEl.innerHTML).toEqual('<span>?</span>');
    done();
  });

  it('should add class bb-help-hide-on-mobile if hideWidgetOnMobile is not false', (done) => {
    const invokerEl: HTMLButtonElement = widgetRenderer.createInvoker();
    const headerConfig = {
      headerColor: 'red',
      headerTextColor: 'blue'
    };

    widgetRenderer.addInvokerStyles(invokerEl, headerConfig);
    expect(invokerEl.classList).toContain(BB_HELP_HIDE_ON_MOBILE_CLASS);
    done();
  });

  it('should not add class bb-help-hide-on-mobile if hideWidgetOnMobile is false', (done) => {
    const invokerEl: HTMLButtonElement = widgetRenderer.createInvoker();
    const headerConfig = {
      headerColor: 'red',
      headerTextColor: 'blue',
      hideWidgetOnMobile: false
    };

    widgetRenderer.addInvokerStyles(invokerEl, headerConfig);
    expect(invokerEl.classList).not.toContain(BB_HELP_HIDE_ON_MOBILE_CLASS);
    done();
  });

  it('should add styles to the invoker to defaults if no header configs exists', (done) => {
    const invokerEl: HTMLButtonElement = widgetRenderer.createInvoker();
    // Different browsers return the color value as rgb or hex.
    const headerTextColorHex: string = '#fffff';
    const headerTextColorRGB: string = 'rgb(255, 255, 255)';

    widgetRenderer.addInvokerStyles(invokerEl, {});

    const TEXT_COLOR: string = (invokerEl.style.color.indexOf('rgb') > -1)
      ? headerTextColorRGB
      : headerTextColorHex;

    expect(invokerEl.style.backgroundColor).toEqual('transparent');
    expect(invokerEl.style.color).toEqual(TEXT_COLOR);
    expect(invokerEl.innerHTML).toEqual('<span>?</span>');
    done();
  });

  it('should append elements to a specified parent', (done) => {
    const iframeEl: HTMLIFrameElement = widgetRenderer.createIframe();
    const containerEl: HTMLElement = widgetRenderer.createContainer();

    widgetRenderer.appendElement(iframeEl, containerEl);
    expect(containerEl.childNodes).toContain(iframeEl);
    done();
  });

  it('should append elements to a the body if no parents is specified', (done) => {
    const iframeEl: HTMLIFrameElement = widgetRenderer.createIframe();
    const bodyEl: HTMLElement = document.body;

    widgetRenderer.appendElement(iframeEl);
    expect(bodyEl.childNodes).toContain(iframeEl);
    done();
  });
});
