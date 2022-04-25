import { CommunicationAction } from '../models/communication-action';

const HOST_ORIGIN: string = 'https://host.nxt.blackbaud.com';

export class BBHelpCommunicationService {
  public childWindow: HTMLIFrameElement;
  public childWindowReady: boolean = false;

  private communicationListener: (action: CommunicationAction) => void;

  public unload(): void {
    window.removeEventListener('message', this.messageHandler);
    this.childWindow = undefined;
    this.childWindowReady = false;
  }

  public bindChildWindowReference(childWindow: any) {
    this.childWindow = childWindow;
    window.addEventListener('message', this.messageHandler);
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
          return reject('The Help Widget\'s Communication Service failed to load.');
        }
      }, duration);
    });
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

  public setListener(listener: (action: CommunicationAction) => void) {
    this.communicationListener = listener;
  }

  private messageHandler = (event: any) => {
    if (this.isFromHelpWidget(event)) {
      const message = event.data;
      switch (message.messageType) {
        case 'ready':
          this.postMessage({ messageType: 'host-ready' });
          this.communicate({ messageType: 'Child Window Ready' });
          this.childWindowReady = true;
          break;
        case 'close-widget':
          this.communicate({ messageType: 'Close Widget' });
          break;
        case 'open-widget':
          this.communicate({ messageType: 'Open Widget', helpKey: message.helpKey });
          break;
        case 'config-loaded':
          this.communicate({ messageType: 'Config Loaded', data: message.data });
          break;
        default:
          console.error(`No matching response for message type: ${message.messageType}`);
          break;
      }
    }
  }

  private communicate(action: CommunicationAction) {
    if (this.communicationListener) {
      this.communicationListener(action);
    }
  }
}
