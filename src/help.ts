declare const BBHELP: any;

import { BBHelpHelpWidget } from './help-widget-wrapper';
import { BBHelpCommunicationService } from './communication.service';
import { HelpConfig } from './help-config';

const demoConfig: HelpConfig = {
  productId: 'bbHelpTesting',
  customLocales: [],
  communityUrl: 'https://community.blackbaud.com/products/blackbaudcrm',
  caseCentralUrl: 'https://www.blackbaud.com/casecentral/casesearch.aspx',
  knowledgebaseUrl: 'https://kb.blackbaud.com/',
  useFlareSearch: true,
  hideHelpChat: true
};

export abstract class BBHelpClient {
  private static communicationService: BBHelpCommunicationService;
  private static defaultHelpKey: string = 'default.html';
  private static currentHelpKey: string;

  private static widgetLoaded: boolean = false;

  public static load(config: any = {}) {
    if (config.defaultHelpKey !== undefined) {
      BBHelpClient.defaultHelpKey = config.defaultHelpKey;
    }

    BBHelpClient.setUpCommunication();
    this.communicationService.ready()
      .then(() => {
        BBHelpClient.sendConfig(config);
        BBHELP.HelpWidget.renderInvoker(config);
        BBHelpClient.widgetLoaded = true;
      });
  }

  public static setCurrentHelpKey(helpKey: string = BBHelpClient.defaultHelpKey): void {
    BBHelpClient.currentHelpKey = helpKey;
  }

  public static setHelpKeyToDefault(): void {
    BBHelpClient.setCurrentHelpKey(BBHelpClient.defaultHelpKey);
  }

  public static openWidgetToHelpKey(helpKey: string = BBHelpClient.currentHelpKey): void {
    BBHELP.HelpWidget.open(helpKey);
  }

  public static getCurrentHelpKey(): string {
    return BBHelpClient.currentHelpKey || BBHelpClient.defaultHelpKey;
  }

  public static toggleOpen(): void {
    BBHELP.HelpWidget.toggleOpen();
  }

  public static openWidget(helpKey?: string): void {
    BBHELP.HelpWidget.open(helpKey);
  }

  public static closeWidget(): void {
    BBHELP.HelpWidget.close();
  }

  public static disableWidget(): void {
    BBHELP.HelpWidget.disableWidget();
  }

  public static enableWidget(): void {
    BBHELP.HelpWidget.enableWidget();
  }

  public static ready(): Promise<any> {
    return BBHelpClient.clientReady()
      .then(() => {
        return this.communicationService.ready();
      })
      .catch((err: string) => {
        console.error(err);
      });
  }

  private static clientReady(): Promise<any> {
    const duration: number = 100;
    const maxIterations: number = 50;

    return new Promise((resolve: any, reject: any) => {
      let readyAttempts: number = 0;

      const interval: any = setInterval(() => {
        readyAttempts++;
        if (BBHelpClient.widgetLoaded) {
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

  private static setUpCommunication() {
    this.communicationService = new BBHelpCommunicationService(BBHELP.HelpWidget.iframeEl);
    this.communicationService.communicationAction.subscribe((action: string) => {
      BBHelpClient.actionResponse(action);
    });
  }

  private static actionResponse(action: string) {
    switch (action) {
      case 'Render Invoker':
        BBHELP.
      break;
      case 'Close Widget':
        BBHELP.HelpWidget.closeWidget();
        break;
      case 'Get Help Key':
        /**
         * Methods can not be added to the config being passed to the SPA through the communicationService. The results of the Help Key need to be passed through when quereied.
         */
        BBHelpClient.sendCurrentHelpKey();
        break;
      default:
    }
  }

  public static sendConfig(config: HelpConfig) {
    BBHelpClient.communicationService.postMessage({
      messageType: 'user-config',
      config: config
    });
  }

  public static sendCurrentHelpKey() {
    BBHelpClient.communicationService.postMessage({
      messageType: 'help-key',
      helpKey: BBHelpClient.getCurrentHelpKey()
    });
  }
}

(function() {
  (window as any).BBHELP = {
    HelpWidget: new BBHelpHelpWidget()
  };

  BBHelpClient.load(demoConfig);
}());
