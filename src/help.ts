declare const BBHELP: any;

import { registerScript } from './register-script';

export class BBHelp {
  private static CURRENT_HELP_KEY: string = 'default.html';

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
    return registerScript('https://cdn.blackbaudcloud.com/bb-help/bb-help.js')
      .then(() => {
        BBHelp.addStyles();
        config.getCurrentHelpKey = this.getCurrentHelpKey;

        // Initialize the widget.
        BBHELP.HelpWidget.load(config);
      });
  }

  public static getCurrentHelpKey(): string {
    return BBHelp.CURRENT_HELP_KEY;
  }

  public static setCurrentHelpKey(helpKey: string): void {
    BBHelp.CURRENT_HELP_KEY = helpKey;
  }

  public static openWidget(): void {
    BBHELP.HelpWidget.open(BBHELP.CURRENT_HELP_KEY);
  }
}
