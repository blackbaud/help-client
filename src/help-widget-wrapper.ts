require('./styles/widget-styles.scss');
require('./styles/omnibar-style-adjustments.scss');

const IFRAME_ID: string = 'bb-help-iframe';
const IFRAME_TITLE: string = 'BB Help';
const IFRAME_SRC: string = 'https://host.nxt.blackbaud.com/bb-help/';
const BB_HEADER_COLOR: string = '#71bf43'
const BB_HEADER_TEXT_COLOR: string = '#fff';
const BB_HELP_INVOKER_ID: string = 'bb-help-invoker';

import { HelpConfig } from './help-config';

export class BBHelpHelpWidget {
  public iframeEl: HTMLIFrameElement;
  private domElement: HTMLElement;
  private invokerEl: HTMLElement;

  constructor() {
    this.createElements();
    this.setUpInvokerEvents();
  }

  private createElements() {
    this.createContainer();
    this.createInvoker();
    this.createIframe();
  }

  public renderInvoker(config: HelpConfig = {}) {
    this.addInvokerStyles(config);
  }

  public closeWidget() {
    this.domElement.classList.add('bb-help-closed');
  }

  private createContainer() {
    this.domElement = document.createElement('div');
    this.domElement.id = 'bb-help-container';
    this.domElement.classList.add('bb-help-container');
    this.domElement.classList.add('bb-help-closed');
    // if (this.hideWidgetOnMobile) {
    //     this.domElement.classList.add('hide-on-mobile');
    // }
    this.appendElement(this.domElement);
  };

  private createInvoker() {
    this.invokerEl = document.createElement('div');
    this.invokerEl.id = BB_HELP_INVOKER_ID;
    this.appendElement(this.invokerEl, this.domElement)
  }

  private createIframe() {
    this.iframeEl = document.createElement('iframe');
    this.iframeEl.id = IFRAME_ID;
    this.iframeEl.title = IFRAME_TITLE;
    this.iframeEl.src = IFRAME_SRC;
    this.appendElement(this.iframeEl, this.domElement);
  }

  private appendElement(el: HTMLElement, parentEl: HTMLElement = document.body) {
    parentEl.appendChild(el);
  }

  private setUpInvokerEvents() {
    this.invokerEl.addEventListener('click', () => {
      this.domElement.classList.toggle('bb-help-closed');
    });
  }

  private addInvokerStyles(config: HelpConfig) {
    this.invokerEl.style.backgroundColor = config.headerColor || BB_HEADER_COLOR;;
    this.invokerEl.style.color = config.headerTextColor || BB_HEADER_TEXT_COLOR;;
    this.invokerEl.style.content = '?';
  }
}
