declare const BBHELP: any;

export class BBHelp {
  public static registerScript(url: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let scriptEl = document.createElement('script');
      scriptEl.onload = resolve;
      scriptEl.onerror = reject;
      scriptEl.src = url;
      document.body.appendChild(scriptEl);
    });
  }

  public static addStyles(): void {
    let css = `
      .bb-omnibar-bar.bar { padding-right: 50px; }
      .bb-omnibar > .bb-omnibar-desktop > .bb-omnibar-accountflyout { right: 50px !important; }
    `;
    let style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  public static load(config: any = {}): Promise<any> {
    return BBHelp.registerScript('https://cdn.blackbaudcloud.com/bb-help/bb-help.js')
      .then(() => {
        BBHelp.addStyles();

        // Initialize the widget.
        BBHELP.HelpWidget.load(config);
      });
  }
}
