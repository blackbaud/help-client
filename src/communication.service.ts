const HOST_ORIGIN: string = 'https://host.nxt.blackbaud.com';
import { Subject } from 'rxjs/Subject';


//TODO:  Create an Observable stream that allows the other classes to tap into events broadcast by this service.
// This will allow us to use the methods such as `close` based on a communication/action.

export class BBHelpCommunicationService {

  public communicationAction: Subject = new Subject();

  private childWindow: any;

  constructor(childWindow: any) {
    window.addEventListener('message', this.messageHandler());
  }

  public messageHandler() {
    return (event: any) => {
      let fromWidget = this.isFromHelpWidget(event);
      if (fromWidget) {
        let message = event.data;
        switch (message.messageType) {
          case 'ready':
            this.postMessage(this.childWindow, { messageType: 'host-ready' });
            break;
          case 'request-config':
            this.postMessage(this.childWindow, {
              messageType: 'user-config',
              config: {
                productId: 'bbHelpTesting',
                customLocales: [],
                communityUrl: 'https://community.blackbaud.com/products/blackbaudcrm',
                caseCentralUrl: 'https://www.blackbaud.com/casecentral/casesearch.aspx',
                knowledgebaseUrl: 'https://kb.blackbaud.com/',
                useFlareSearch: true,
                hideHelpChat: true
              }
          });
          break;
          case 'close-widget':
            console.log('close widget comm');
          default:
            break;
        }
      }
    }
  }

  public isFromHelpWidget(event: { origin: string, data: any }): boolean {
    if (event.origin === HOST_ORIGIN ) {
      const message = event.data;
      return !!message && message.source === 'skyux-spa-bb-help';
    }

    return false;
  }

  public postMessage(childWindow: HTMLIFrameElement, message: any, origin: string = HOST_ORIGIN) {
    message.source = 'help-client';
    childWindow.contentWindow.postMessage(message, origin);
  }
}
