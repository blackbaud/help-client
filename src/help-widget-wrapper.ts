require('./styles/widget-styles.scss');
require('./styles/omnibar-style-adjustments.scss');

const IFrameClass: string = 'bb-help-iframe';
const BB_HEADER_COLOR: string = '#71bf43'
const BB_HEADER_TEXT_COLOR: string = '#fff';
const BB_HELP_INVOKER_ID: string = 'bb-help-invoker';

import { HelpConfig } from './help-config';
import { BBHelpCommunicationService } from './communication.service';

export class BBHelpHelpWidget {
  private domElement: HTMLElement;
  private invokerEl: HTMLElement;
  private iframeEl: HTMLIFrameElement;
  private config : HelpConfig;
  private communicationService: BBHelpCommunicationService;

  public load(config: HelpConfig = {}) {
    this.config = config;
    this.renderElements();
    this.addStyles();
    this.setUpEvents();
  }

  private renderElements() {
    this.createContainer();
    this.createInvoker();
    this.addIframe(
      'https://host.nxt.blackbaud.com/bb-help/',
      IFrameClass,
      'BB Help'
    );
  }

  private addStyles() {
    this.addInvokerStyles();
    this.addIframeStyles();
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

  private closeWidget() {
    this.domElement.classList.add('bb-help-closed');
  }

  private createInvoker(config?: any) {
    this.invokerEl = document.createElement('div');
    this.invokerEl.id = BB_HELP_INVOKER_ID;
    this.appendElement(this.invokerEl, this.domElement)
  }

  private addInvokerStyles() {
    this.invokerEl.style.backgroundColor = this.config.headerColor || BB_HEADER_COLOR;;
    this.invokerEl.style.color = this.config.headerTextColor || BB_HEADER_TEXT_COLOR;;
    this.invokerEl.style.content = '?';
  }

  private setUpInvokerEvents() {
    this.invokerEl.addEventListener('click', () => {
      this.domElement.classList.toggle('bb-help-closed');
    });
  }

  private addIframe(
    src: string,
    id: string,
    title: string
  ): void {
    const iframeEl = document.createElement('iframe');
    iframeEl.id = id;
    iframeEl.title = title;
    iframeEl.src = src;

    this.appendElement(iframeEl, this.domElement);

    this.iframeEl = iframeEl;
  }

  private addIframeStyles() {
    this.iframeEl.style.height = '100%';
    this.iframeEl.style.width = '100%';
    this.iframeEl.style.border = 'none';
  }

  private appendElement(el: HTMLElement, parentEl: HTMLElement = document.body) {
    parentEl.appendChild(el);
  }

  private setUpEvents() {
    this.setUpInvokerEvents();
  }
}
