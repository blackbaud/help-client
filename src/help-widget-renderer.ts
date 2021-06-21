import { HelpConfig, WhatsNewConfig } from './help-config';

const IFRAME_ID: string = 'bb-help-iframe';
const IFRAME_TITLE: string = 'BB Help';
const IFRAME_SRC: string = 'https://host.nxt.blackbaud.com/bb-help/';
const BB_HELP_INVOKER_ID: string = 'bb-help-invoker';
const BB_HELP_HIDE_ON_MOBILE_CLASS: string = 'bb-help-hide-on-mobile';

const SEPARATOR: '|' = '|';
type LinkMenuItem = { label: string, url: string, newTab: boolean, class?: string };
type SeparatorMenuItem = { label: typeof SEPARATOR };
type MenuItem = LinkMenuItem | SeparatorMenuItem;

function isSeparator(item: MenuItem): item is SeparatorMenuItem {
  return item.label === SEPARATOR;
}

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

  public createMenu(contentUrl: string, newFeatureConfig: WhatsNewConfig): HTMLDivElement {
    const menuItemInfo: MenuItem[] = [
      { label: 'Open help', url: contentUrl, class: 'bb-help-content-link', newTab: true },
      { label: SEPARATOR },
      { label: 'Support resources', url: 'https://support.blackbaud.com', newTab: true }
    ];
    if (newFeatureConfig && newFeatureConfig.url) {
      const whatsNewItem = { label: 'What\'s new', url: newFeatureConfig.url, newTab: newFeatureConfig.newTab };
      menuItemInfo.splice(1, 0, whatsNewItem);
    }
    const menu = document.createElement('div');
    menu.classList.add('help-menu');
    menu.classList.add('help-menu-collapse');
    menu.setAttribute('role', 'menu');
    menuItemInfo.map(label => this.createMenuItem(label))
      .forEach(item => menu.appendChild(item));
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

  /**
   * Creates a menu item based on the label and url.
   * If the label is {@link SEPARATOR}, then a separator item is created and the url is ignored.
   */
  private createMenuItem(item: MenuItem): HTMLAnchorElement | HTMLDivElement {
    if (isSeparator(item)) {
      const separator = document.createElement('div');
      separator.classList.add('help-menu-separator');
      separator.setAttribute('aria-hidden', 'true');
      return separator;
    } else {
      const anchor = document.createElement('a');
      anchor.href = item.url;
      if (item.newTab) {
        anchor.target = '_blank';
      }
      anchor.classList.add('help-menu-item');
      if (item.class) {
        anchor.classList.add(item.class);
      }
      anchor.setAttribute('role', 'menuitem');
      anchor.appendChild(document.createTextNode(item.label));
      return anchor;
    }
  }
}
