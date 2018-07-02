require('./styles/widget-styles.scss');
require('./styles/omnibar-style-adjustments.scss');
const IFrameClass: string = 'bb-help-iframe';
const BB_GREEN: string = '#71bf43'


const HOST_ORIGIN: string = 'https://host.nxt.blackbaud.com';

export class HelpWidget {
  private domElement: HTMLElement;
  private invokerEl: HTMLElement;
  private iframeEl: HTMLIFrameElement;

  public constructor() {
    this.init();
  }

  public load() {
    console.log('loading');
  }

  private init() {
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
    window.addEventListener('message', this.messageHandler());
  }

  public messageHandler() {
    return (event: any) => {
      let fromWidget = this.isFromHelpWidget(event);
      if (fromWidget) {
        let message = event.data;
        switch (message.messageType) {
          case 'ready':
            this.postMessage(this.iframeEl, { messageType: 'host-ready' });
            break;
          case 'request-config':
            this.postMessage(this.iframeEl, {
              messageType: 'user-config',
              config: {
                productId: 'this is way different',
                customLocales: [],
                communityUrl: 'https://community.blackbaud.com/products/blackbaudcrm',
                caseCentralUrl: 'https://www.blackbaud.com/casecentral/casesearch.aspx',
                knowledgebaseUrl: 'https://kb.blackbaud.com/',
                useFlareSearch: true,
                hideHelpChat: true
              }
          });
          default:
            break;
        }
      }
    }
  }

  public postMessage(iframeEl: HTMLIFrameElement, message: any, origin: string = HOST_ORIGIN) {
    message.source = 'help-client';
    iframeEl.contentWindow.postMessage(message, origin);
  }

  public isFromHelpWidget(event: { origin: string, data: any }): boolean {
    if (event.origin === HOST_ORIGIN ) {
      const message = event.data;
      return !!message && message.source === 'skyux-spa-bb-help';
    }

    return false;
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

  private createInvoker(config?: any) {
    this.invokerEl = document.createElement('div');
    this.invokerEl.id = 'bb-help-invoker';
    this.appendElement(this.invokerEl, this.domElement)
  }

  private addInvokerStyles(config?: any) {
    let backgroundColor = BB_GREEN;
    let textColor = '#fff';
    this.invokerEl.style.backgroundColor = backgroundColor;
    this.invokerEl.style.color = textColor;
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

(function() {
  'use strict';
  (window as any).BBHELP = {
    HelpWidget: new HelpWidget()
  };
}());
