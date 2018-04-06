declare const BBHELP: any;

import { registerScript } from './register-script';

export abstract class BBHelpClient {
  private static defaultHelpKey: string = 'default.html';
  private static currentHelpKey: string;

  private static widgetLoaded: boolean = false;

  public static addStyles(): void {
    const css = `
      .bb-omnibar-bar.bar { padding-right: 50px !important; }
      .bb-omnibar > .bb-omnibar-desktop > .bb-omnibar-accountflyout { right: 50px !important; }
      #bb-help-container { z-index: 9999; }
    `;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  public static load(config: any = {}): Promise<any> {
    if (config.defaultHelpKey !== undefined) {
      BBHelpClient.defaultHelpKey = config.defaultHelpKey;
    }

    config.getCurrentHelpKey = BBHelpClient.getCurrentHelpKey;

    return registerScript('https://cdn.blackbaudcloud.com/bb-help/bb-help.js')
      .then(() => {
        BBHelpClient.addStyles();
        // Initialize the widget.
        BBHELP.HelpWidget.load(config);
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

  public static openWidget(): void {
    BBHELP.HelpWidget.open();
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
