import { BBHelpHelpWidget } from './help-widget';
import { BBHelpHelpWidgetRenderer } from './help-widget-renderer';
import { BBHelpStyleUtility } from './help-widget-style-utility';
import { BBHelp } from './models/bbhelp';

declare const BBHELP: any;

export abstract class BBHelpClient {

  public static initWidget(): BBHelp {
    const styleUtility = new BBHelpStyleUtility();
    const widgetRenderer = new BBHelpHelpWidgetRenderer();
    const helpWidget = new BBHelpHelpWidget(widgetRenderer, styleUtility);
    return { HelpWidget: helpWidget };
  }

  public static load(config: any = {}) {
    return BBHELP.HelpWidget.load(config);
  }

  public static unload(): void {
    BBHELP.HelpWidget.unload();
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

  public static getWhatsNewRevision(): void {
    BBHELP.HelpWidget.getWhatsNewRevision();
  }

  public static ready(): Promise<any> {
    return BBHELP.HelpWidget.ready()
      .catch((err: string) => {
        console.error(err);
      });
  }
}

(() => {
  (window as any).BBHELP = BBHelpClient.initWidget();
})();
