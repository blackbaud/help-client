require('./styles/widget-styles.scss');
require('./styles/omnibar-style-adjustments.scss');

const IFRAME_ID: string = 'bb-help-iframe';
const IFRAME_TITLE: string = 'BB Help';
const IFRAME_SRC: string = 'https://host.nxt.blackbaud.com/bb-help/';
const BB_HEADER_COLOR: string = '#71bf43'
const BB_HEADER_TEXT_COLOR: string = '#fff';
const BB_HELP_INVOKER_ID: string = 'bb-help-invoker';

import { HelpConfig } from './help-config';

export class BBHelpHelpWidgetRenderer {

  public addInvokerStyles(invoker: HTMLElement, config: HelpConfig) {
    invoker.style.backgroundColor = config.headerColor || BB_HEADER_COLOR;;
    invoker.style.color = config.headerTextColor || BB_HEADER_TEXT_COLOR;;
    invoker.style.content = '?';
  }
  
  public createContainer(): HTMLElement {
    let domElement: HTMLElement;
    domElement = document.createElement('div');
    domElement.id = 'bb-help-container';
    domElement.classList.add('bb-help-container');
    domElement.classList.add('bb-help-closed');
    // if (this.hideWidgetOnMobile) {
    //     this.domElement.classList.add('hide-on-mobile');
    // }
    return domElement;
  };

  public createInvoker(): HTMLElement {
    let invoker: HTMLElement;
    invoker = document.createElement('div');
    invoker.id = BB_HELP_INVOKER_ID;
    return invoker;
  }

  public createIframe(): HTMLIFrameElement {
    let iframe: HTMLIFrameElement;
    iframe = document.createElement('iframe');
    iframe.id = IFRAME_ID;
    iframe.title = IFRAME_TITLE;
    iframe.src = IFRAME_SRC;
    return iframe;
  }

  public appendElement(el: HTMLElement, parentEl: HTMLElement = document.body) {
    parentEl.appendChild(el);
  }
}
