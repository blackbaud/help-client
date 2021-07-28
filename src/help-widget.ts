import { HelpConfig } from './help-config';
import { mergeConfig } from './service/config-merge.utils';

export class BBHelpHelpWidget {
  public config: HelpConfig;
  public currentHelpKey: string;
  public onHelpLoaded: any;
  private widgetDisabled: boolean = false;
  private defaultHelpKey: string = 'default.html';
  private loadCalled: boolean = false;

  /**
   * @deprecated
   */
  public init() {
  }

  /**
   * @deprecated
   */
  public ready() {
    return Promise.resolve();
  }

  /**
   * @deprecated
   */
  public unload(): void {
    if (this.loadCalled) {
      this.onHelpLoaded = undefined;
      this.currentHelpKey = undefined;
      this.getCurrentHelpKey = () => this.currentHelpKey || this.defaultHelpKey;
      this.defaultHelpKey = 'default.html';
      this.config = undefined;
      this.loadCalled = false;
    }
  }

  /**
   * @deprecated
   */
  public load(config: HelpConfig, location: Location = window.location) {
    if (this.loadCalled) {
      return;
    }

    return this.ready()
      .then(() => {
        this.loadCalled = true;
        this.config = mergeConfig(config);
        if (this.config.defaultHelpKey !== undefined) {
          this.defaultHelpKey = this.config.defaultHelpKey;
        }

        // TODO move to mergeConfig
        this.config.hostQueryParams = location.search;

        if (this.config.getCurrentHelpKey !== undefined) {
          this.getCurrentHelpKey = this.config.getCurrentHelpKey;
          delete this.config.getCurrentHelpKey;
        }

        if (this.config.onHelpLoaded !== undefined) {
          this.onHelpLoaded = this.config.onHelpLoaded;
          delete this.config.onHelpLoaded;
        }
        if (this.config.defaultHelpKey) {
          this.defaultHelpKey = this.config.defaultHelpKey;
        }

        if (this.onHelpLoaded) {
          this.onHelpLoaded();
        }
      });
  }

  /**
   * Help keys are opened into new tabs, thus closing the widget isn't relevant anymore.
   * @deprecated This is a no-op function for backward compatibility.
   */
  public close() {
    // no op
  }

  public open(helpKey: string = this.getHelpKey()) {
    if (!this.widgetDisabled) {
      const url = `${this.config.helpBaseUrl}${helpKey}`;
      window.open(url, '_blank');
    }
  }

  /**
   * Help keys are opened into new tabs, thus toggling the widget isn't relevant anymore.
   * @deprecated This function will always open for backward compatibility.
   */
  public toggleOpen(helpKey?: string) {
    if (this.isCollapsed()) {
      this.open(helpKey);
    } else {
      this.close();
    }
  }

  public setCurrentHelpKey(helpKey: string = this.defaultHelpKey): void {
    this.currentHelpKey = helpKey;
    // TODO how do we tell omnibar of this
  }

  public setHelpKeyToDefault(): void {
    this.setCurrentHelpKey(this.defaultHelpKey);
  }

  public disableWidget(): void {
    this.widgetDisabled = true;
    this.close();
  }

  public enableWidget(): void {
    this.widgetDisabled = false;
  }

  /**
   * This was a proposed solution to What's new years ago that never was acted upon.
   * This is kept around solely for backwards compatibility because the method is public.
   * @deprecated
   */
  public getWhatsNewRevision(): number {
    if (this.config.whatsNewRevisions && this.config.whatsNewRevisions.length > 0) {
      const revisions = this.config.whatsNewRevisions.split(';');
      const foundRevision = revisions.find((revision: any) => {
        return revision.includes(`${this.config.productId}=`);
      });
      if (foundRevision) {
        return parseInt(foundRevision.substring(this.config.productId.length + 1), 10);
      }
    }
    return 0;
  }

  /**
   * @deprecated widget no longer expands, thus it is always collapsed in the original definition of the function.
   */
  private isCollapsed() {
    return true;
  }

  private getHelpKey() {
    if ((typeof (this.getCurrentHelpKey) === 'function')) {
      return this.getCurrentHelpKey();
    }

    return this.getCurrentHelpKey;
  }

  private getCurrentHelpKey: any = () => {
    return this.currentHelpKey || this.defaultHelpKey;
  }
}
