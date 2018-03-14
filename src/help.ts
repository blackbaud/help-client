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
    BBHelpClient.executeWhenReady(
      () => {
        BBHELP.HelpWidget.open(helpKey);
      });
  }

  public static getCurrentHelpKey(): string {
    return BBHelpClient.currentHelpKey || BBHelpClient.defaultHelpKey;
  }

  public static toggleOpen(): void {
    BBHelpClient.executeWhenReady(BBHELP.HelpWidget.toggleOpen);
  }

  public static openWidget(): void {
    BBHelpClient.executeWhenReady(BBHELP.HelpWidget.open);
  }

  public static closeWidget(): void {
    BBHelpClient.executeWhenReady(BBHELP.HelpWidget.close);
  }

  public static disableWidget(): void {
    BBHelpClient.executeWhenReady(BBHELP.HelpWidget.disableWidget);
  }

  public static enableWidget(): void {
    BBHelpClient.executeWhenReady(BBHELP.HelpWidget.enableWidget);
  }

  private static executeWhenReady(actionCallback: Function) {
    BBHelpClient.ready()
      .then(() => {
        actionCallback();
      })
      .catch(err => {
        console.error(err);
      });
  }

  private static ready() {
    return new Promise((resolve, reject) => {
      let readyAttempts: number = 0;
      const duration: number = 100;
      const maxIterations: number = 100;

      const interval = setInterval(() => {
        readyAttempts++;

        if (BBHelpClient.widgetLoaded) {
          clearInterval(interval);
          return resolve();
        }

        if (maxIterations >= 100) {
          clearInterval(interval);
          return reject('The Help Widget failed to load.');
        }
      }, duration);
    });
  }
}
