declare const BBHELP: any;

import { registerScript } from './register-script';

export class BBHelp {
  private static defaultHelpKey: string = 'default.html';
  private static currentHelpKey: string;

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
      BBHelp.defaultHelpKey = config.defaultHelpKey;
    }

    config.getCurrentHelpKey = BBHelp.getCurrentHelpKey;

    return registerScript('https://cdn.blackbaudcloud.com/bb-help/bb-help.js')
      .then(() => {
        BBHelp.addStyles();
        // Initialize the widget.
        BBHELP.HelpWidget.load(config);
      });
  }

  public static setCurrentHelpKey(helpKey: string = BBHelp.defaultHelpKey): void {
    BBHelp.currentHelpKey = helpKey;
  }

  public static resetCurrentHelpKeyToDefault(): void {
    BBHelp.currentHelpKey = BBHelp.defaultHelpKey;
  }

  public static openWidgetToHelpKey(helpKey: string = BBHelp.currentHelpKey): void {
    BBHELP.HelpWidget.open(helpKey);
  }

  private static getCurrentHelpKey(): string {
    return BBHelp.currentHelpKey;
  }
}
