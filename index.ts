declare const jQuery: any;
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
    let promises: Promise<any>[] = [];

    if (!jQuery) {
      promises.push(
        BBHelp.registerScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.js')
      );
    }

    promises.push(
      BBHelp.registerScript('https://cdn.blackbaudcloud.com/bb-help/bb-help.js')
    );

    return Promise.all(promises)
      .then(() => {
        BBHELP.HelpWidget.load(config);
      });
  }
}
