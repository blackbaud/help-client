const HOST_ORIGIN: string = 'https://host.nxt.blackbaud.com';
import { Subject } from 'rxjs';

export class BBHelpCommunicationService {

  public communicationAction: Subject<any> = new Subject();

  public childWindowReady: boolean = false;

  public clientReady: boolean = false;

  constructor(private childWindow: any) {
    window.addEventListener('message', this.messageHandler());
  }

  public ready() {
    return new Promise((resolve, reject) => {
      let readyAttempts = 0;
      const duration = 100;
      const maxIterations = 50;

      const interval = setInterval(() => {
        readyAttempts++;
        if (this.childWindowReady) {
          clearInterval(interval);
          return resolve('Communication Service Ready');
        }

        if (readyAttempts >= maxIterations) {
          clearInterval(interval);
          return reject('The Help Widget failed to load.');
        }
      }, duration);
    });
  }

  public messageHandler() {
    return (event: any) => {
      if (this.isFromHelpWidget(event)) {
        const message = event.data;
        switch (message.messageType) {
          case 'ready':
            this.postMessage({ messageType: 'host-ready' });
            this.communicationAction.next('Child Window Ready');
            this.childWindowReady = true;
            break;
          case 'close-widget':
            this.communicationAction.next('Close Widget');
            break;
          default:
            console.error(`No matching response for message type: ${message.messageType}`);
            break;
        }
      } else {
        console.error(`Event origin not supported.`);
      }
    };
  }

  public isFromHelpWidget(event: { origin: string, data: any }): boolean {
    if (event.origin === HOST_ORIGIN) {
      const message = event.data;
      return !!message && message.source === 'skyux-spa-bb-help';
    }

    return false;
  }

  public postMessage(message: any, origin: string = HOST_ORIGIN) {
    message.source = 'help-client';
    this.childWindow.contentWindow.postMessage(message, origin);
  }
}
