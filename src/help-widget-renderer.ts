import { HelpConfig } from './help-config';

const IFRAME_ID: string = 'bb-help-iframe';
const IFRAME_TITLE: string = 'BB Help';
const IFRAME_SRC: string = 'https://host.nxt.blackbaud.com/bb-help/';
// Some browsers return the hexdecimal values are rgb and vice versa when the style is set with javascript.
const BB_HEADER_COLOR: string = '#71bf43'; // 'rgb(113, 191, 67)';
const BB_HEADER_TEXT_COLOR: string = '#fff'; // 'rgb(255, 255, 255)';
const BB_HELP_INVOKER_ID: string = 'bb-help-invoker';
const BB_HELP_HIDE_ON_MOBILE_CLASS: string = 'bb-help-hide-on-mobile';
export class BBHelpHelpWidgetRenderer {

  public createContainer(): HTMLElement {
    let domElement: HTMLElement;
    domElement = document.createElement('div');
    domElement.id = 'bb-help-container';
    domElement.classList.add('bb-help-container');
    domElement.classList.add('bb-help-closed');
    return domElement;
  }

  public createInvoker(): HTMLButtonElement {
    let invoker: HTMLButtonElement;
    invoker = document.createElement('button');
    invoker.setAttribute('aria-title', 'Toggle Help Widget');
    invoker.setAttribute('aria-controls', 'bb-help-container');
    invoker.setAttribute('aria-pressed', 'false');
    invoker.id = BB_HELP_INVOKER_ID;
    return invoker;
  }

  /**
   * @deprecated
   */
  public createIframe(): HTMLIFrameElement {
    let iframe: HTMLIFrameElement;
    iframe = document.createElement('iframe');
    iframe.id = IFRAME_ID;
    iframe.title = IFRAME_TITLE;
    iframe.src = IFRAME_SRC;
    return iframe;
  }

  public addInvokerStyles(invoker: HTMLElement, config: HelpConfig) {
    invoker.style.backgroundColor = config.headerColor || BB_HEADER_COLOR;
    invoker.style.color = config.headerTextColor || BB_HEADER_TEXT_COLOR;
    invoker.innerHTML = '<span>?</span>';
    if (config.hideWidgetOnMobile !== false) {
      invoker.classList.add(BB_HELP_HIDE_ON_MOBILE_CLASS);
    }
  }

  public appendElement(el: HTMLElement, parentEl: HTMLElement = document.body) {
    parentEl.appendChild(el);
  }
}
