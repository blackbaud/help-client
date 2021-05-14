import { HelpConfig } from './help-config';

const IFRAME_ID: string = 'bb-help-iframe';
const IFRAME_TITLE: string = 'BB Help';
const IFRAME_SRC: string = 'https://host.nxt.blackbaud.com/bb-help/';
const BB_HELP_INVOKER_ID: string = 'bb-help-invoker';
const BB_HELP_HIDE_ON_MOBILE_CLASS: string = 'bb-help-hide-on-mobile';

export class BBHelpHelpWidgetRenderer {

  public createContainer(): HTMLElement {
    let domElement: HTMLElement;
    domElement = document.createElement('div');
    domElement.id = 'bb-help-container';
    domElement.classList.add('bb-help-container');
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

  public createMenu(): HTMLDivElement {
    const labels = ['Get help', 'What\'s new', 'Support resources'];
    const menu = document.createElement('div');
    menu.classList.add('help-menu');
    menu.classList.add('help-menu-collapse');
    menu.setAttribute('role', 'menu');
    const items = labels.map(label => this.createMenuItem(label));
    items.forEach(item => menu.appendChild(item));
    return menu;
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
    if (config.headerColor) {
      invoker.style.backgroundColor = config.headerColor;
    }
    if (config.headerTextColor) {
      invoker.style.color = config.headerTextColor;
    }
    invoker.innerHTML = '<span>?</span>';
    if (config.hideWidgetOnMobile !== false) {
      invoker.classList.add(BB_HELP_HIDE_ON_MOBILE_CLASS);
    }
  }

  public appendElement(el: HTMLElement, parentEl: HTMLElement = document.body) {
    parentEl.appendChild(el);
  }

  private createMenuItem(label: string): HTMLAnchorElement {
    const item = document.createElement('a');
    item.href = 'https://duckduckgo.com';
    item.target = '_blank';
    item.classList.add('help-menu-item');
    item.setAttribute('role', 'menuitem');
    item.appendChild(document.createTextNode(label));
    return item;
  }
}
