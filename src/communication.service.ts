const HOST_ORIGIN: string = 'https://host.nxt.blackbaud.com';
import {Subject} from 'rxjs';

export class BBHelpCommunicationService {

  public communicationAction: Subject<any> = new Subject();

  public childWindowReady: boolean = false;

  constructor(private childWindow: any) {
    window.addEventListener('message', this.messageHandler());
  }

  public messageHandler() {
    return (event: any) => {
      let fromWidget = this.isFromHelpWidget(event);
      if (fromWidget) {
        let message = event.data;
        switch (message.messageType) {
          case 'ready':
          console.log('???');
            this.postMessage({ messageType: 'host-ready' });
            this.childWindowReady = true;
            break;
          case 'close-widget':
            this.communicationAction.next('Close Widget');
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

  public postMessage(message: any, origin: string = HOST_ORIGIN) {
    console.log('posting', message, 'origin', origin);
    message.source = 'help-client';
    this.childWindow.contentWindow.postMessage(message, origin);
  }
}
