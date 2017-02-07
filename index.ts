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

  public static load(config: any = {}): Promise<any> {
    return BBHelp.registerScript('https://cdn.blackbaudcloud.com/bb-help/bb-help.js')
      .then(() => {
        BBHELP.HelpWidget.load(config);
      });
  }
}
