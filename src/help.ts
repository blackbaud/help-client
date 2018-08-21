
import { HelpConfig } from './help-config';
import { BBHelpHelpWidget } from './help-widget';

declare const BBHELP: any;

const demoConfig: HelpConfig = {
  customLocales: [],
  defaultHelpKey: 'bb-role-based-best-practices.html',
  extends: 'renxt'
};

export abstract class BBHelpClient {

  public static load(config: any = {}) {
    return BBHELP.HelpWidget.ready()
      .then(() => {
        BBHELP.HelpWidget.load(config);
      });
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

  public static getCurrentHelpKey(): string {
    return BBHELP.HelpWidget.getCurrentHelpKey();
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
  (window as any).BBHELP = {
    HelpWidget: new BBHelpHelpWidget()
  };

  BBHelpClient.load(demoConfig);
})();
