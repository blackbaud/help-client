declare const BBHELP: any;

import { registerScript } from './register-script';

export class BBHelp {
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

        // Initialize the widget.
        BBHELP.HelpWidget.load(config);
      });
  }
}
