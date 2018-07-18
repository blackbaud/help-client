require('./styles/widget-styles.scss');
require('./styles/omnibar-style-adjustments.scss');

const IFRAME_ID: string = 'bb-help-iframe';
const IFRAME_TITLE: string = 'BB Help';
const IFRAME_SRC: string = 'https://host.nxt.blackbaud.com/bb-help/';
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

  constructor() {
    this.createElements();
    this.setUpInvokerEvents();
    this.setUpCommunication();
  }

  private createElements() {
    this.createContainer();
    this.createInvoker();
    this.createIframe();
  }

  public load(config: HelpConfig = {}) {
    this.config = config;
    this.addInvokerStyles();
    this.sendConfig();
  }

  public ready() {
    return new Promise((resolve, reject) => {
        let readyAttempts = 0;
        const duration = 100;
        const maxIterations = 100;

        const interval = setInterval(() => {
          readyAttempts++;
          if (this.communicationService.childWindowReady) {
              clearInterval(interval);
              resolve();
          }

          if (readyAttempts >= maxIterations) {
              clearInterval(interval);
              reject('The Help Widget failed to load.');
          }
        }, duration);
    });
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

  private createInvoker(config?: any) {
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

  private setUpCommunication() {
    this.communicationService = new BBHelpCommunicationService(this.iframeEl);
    this.communicationService.communicationAction.subscribe((action: string) => {
      this.actionResponse(action);
    });
  }

  private actionResponse(action: string) {
    switch (action) {
      case 'Close Widget':
        this.closeWidget();
        break;
      default:
    }
  }

  private closeWidget() {
    this.domElement.classList.add('bb-help-closed');
  }

  private addInvokerStyles() {
    this.invokerEl.style.backgroundColor = this.config.headerColor || BB_HEADER_COLOR;;
    this.invokerEl.style.color = this.config.headerTextColor || BB_HEADER_TEXT_COLOR;;
    this.invokerEl.style.content = '?';
  }

  public sendConfig() {
    this.communicationService.postMessage(this.iframeEl, {
        messageType: 'user-config',
        config: this.config
    });
  }
}
