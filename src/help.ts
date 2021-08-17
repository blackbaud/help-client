
import { BBHelpHelpWidget } from './help-widget';
import { BBHelpHelpWidgetRenderer } from './help-widget-renderer';
import { BBHelpStyleUtility } from './help-widget-style-utility';
import { BBHelp } from './models/bbhelp';
import { BBHelpCommunicationService } from './service/communication.service';

declare const BBHELP: any;

export abstract class BBHelpClient {

  public static initWidget(): BBHelp {
    const styleUtility = new BBHelpStyleUtility();
    const widgetRenderer = new BBHelpHelpWidgetRenderer();
    const communicationService = new BBHelpCommunicationService();
    const helpWidget = new BBHelpHelpWidget(
      widgetRenderer,
      communicationService,
      styleUtility
    );
    return { HelpWidget: helpWidget };
  }

  public static load(config: any = {}) {
    return BBHELP.HelpWidget.load(config);
  }

  public static unload() {
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

  /**
   * This only opens when {@link HelpConfig#mimicOmnibar} is true.
   * Instead of using this method, disable omnibar mimicking and use {@link BBHelpClient#openWidget} directly instead.
   * @deprecated
   */
  public static toggleOpen(): void {
    BBHELP.HelpWidget.toggleOpen();
  }

  public static openWidget(helpKey?: string): void {
    BBHELP.HelpWidget.open(helpKey);
  }

  /**
   * This does nothing when {@link HelpConfig#mimicOmnibar} is true.
   * Instead of using this method, disable omnibar mimicking.
   * @deprecated
   */
  public static closeWidget(): void {
    BBHELP.HelpWidget.close();
  }

  public static disableWidget(): void {
    BBHELP.HelpWidget.disableWidget();
  }

  public static enableWidget(): void {
    BBHELP.HelpWidget.enableWidget();
  }

  /**
   * This was a proposed solution to What's new years ago that never was acted upon.
   * This is kept around solely for backwards compatibility because the method is public.
   * @deprecated
   */
  public static getWhatsNewRevision(): void {
    BBHELP.HelpWidget.getWhatsNewRevision();
  }

  /**
   * This was not intended to be public.
   * It is not recommended for consumers to use.
   * Use {@link BBHelpClient#load} instead.
   * @deprecated
   */
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
