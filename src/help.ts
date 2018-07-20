declare const BBHELP: any;

import { BBHelpHelpWidget } from './help-widget';
import { HelpConfig } from './help-config';

const demoConfig: HelpConfig = {
  productId: 'bbHelpTesting',
  customLocales: [],
  communityUrl: 'https://community.blackbaud.com/products/blackbaudcrm',
  caseCentralUrl: 'https://www.blackbaud.com/casecentral/casesearch.aspx',
  knowledgebaseUrl: 'https://kb.blackbaud.com/',
  useFlareSearch: true,
  hideHelpChat: true,
  headerColor: '#dcdcdc'
};

export abstract class BBHelpClient {
  private static widgetLoaded: boolean = false;

  public static load(config: any = {}) {
    BBHELP.HelpWidget.load(config)
      .then(() => {
        this.widgetLoaded = true;
      });
  }

  public static setCurrentHelpKey(helpKey?: string): void {
    BBHELP.HelpWidget.setCurrentHelpKey(helpKey);
  }

  public static setHelpKeyToDefault(): void {
    BBHELP.HelpWidget.setHelpKeyToDefault();
  }

  public static openWidgetToHelpKey(helpKey: string): void {
    BBHELP.HelpWidget.open(helpKey);
  }

  public static getCurrentHelpKey(): string {
    return BBHELP.HelpWidget.getCurrentHelpKey();
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
        return BBHELP.HelpWidget.ready();
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
}

(function() {
  (window as any).BBHELP = {
    HelpWidget: new BBHelpHelpWidget()
  };

  BBHelpClient.load(demoConfig);
}());
