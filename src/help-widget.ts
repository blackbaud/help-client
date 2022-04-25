import { HelpConfig } from './help-config';
import { BBHelpHelpWidgetRenderer } from './help-widget-renderer';
import { BBHelpStyleUtility } from './help-widget-style-utility';

import { CommunicationAction } from './models/communication-action';
import { BBHelpCommunicationService } from './service/communication.service';
import { mergeConfig } from './service/config-merge.utils';

const HELP_CLOSED_CLASS: string = 'bb-help-closed';
const MOBILE_CONTAINER_CLASS: string = 'bb-help-container-mobile';
const DISABLE_TRANSITION: string = 'bb-help-disable-transition';
const MOBILE_WIDTH_CLASS: string = 'bb-help-mobile-width';
const SCREEN_XS_MAX: number = 767;
const PANEL_HEIGHT: number = 591;

export class BBHelpHelpWidget {
  /**
   * This was not intended to be public.
   * It is not recommended for consumers to use.
   * @deprecated
   */
  public iframe: HTMLIFrameElement;
  /**
   * This was not intended to be public.
   * It is not recommended for consumers to use.
   * @deprecated
   */
  public config: HelpConfig;
  /**
   * This was not intended to be public.
   * It is not recommended for consumers to use.
   * @deprecated
   */
  public currentHelpKey: string;
  /**
   * This was not intended to be public.
   * It is not recommended for consumers to use.
   * @deprecated
   */
  public onHelpLoaded: any;
  private widgetRenderer: BBHelpHelpWidgetRenderer;
  private communicationService: BBHelpCommunicationService;
  private styleUtility: BBHelpStyleUtility;
  private container: HTMLElement;
  private invoker: HTMLElement;
  private maxReadyChecks: number = 50;
  private elementsLoaded: boolean = false;
  private widgetDisabled: boolean = false;
  private defaultHelpKey: string = 'default.html';
  private loadCalled: boolean = false;
  private isSetForMobile: boolean;
  private helpUpdateCallback: (args: { url: string }) => void = undefined;

  constructor(
    widgetRenderer: BBHelpHelpWidgetRenderer,
    communicationService: BBHelpCommunicationService,
    styleUtility: BBHelpStyleUtility
  ) {
    this.styleUtility = styleUtility;
    this.widgetRenderer = widgetRenderer;
    this.communicationService = communicationService;
  }

  /**
   * This was not intended to be public.
   * It is not recommended for consumers to use.
   * Use {@link BBHelpHelpWidget#load} instead.
   * @deprecated
   */
  public init() {
    if (this.isOmnibarMimickingEnabled()) {
      this.styleUtility.addAllStyles();
      this.createElements();
      this.setUpInvokerEvents();
      this.renderElements();
      this.setUpCommunication();
      window.addEventListener('resize', this.setClassesForWindowSize);
    }
  }

  /**
   * This was not intended to be public.
   * It is not recommended for consumers to use.
   * Use {@link BBHelpHelpWidget#load} instead.
   * @deprecated
   */
  public ready() {
    if (this.isOmnibarMimickingDisabled()) {
      return Promise.resolve();
    }
    return this.widgetReady()
      .then(() => {
        return this.communicationService.ready();
      })
      .catch((err: string) => {
        console.error(err);
      });
  }

  public unload(): void {
    if (!this.loadCalled) {
      return;
    }
    if (this.isOmnibarMimickingEnabled()) {
      this.invoker.remove();
      this.invoker = undefined;
      this.iframe.remove();
      this.iframe = undefined;
      this.container.remove();
      this.container = undefined;
      this.communicationService.unload();
      this.styleUtility.removeAllStyles();
      window.removeEventListener('resize', this.setClassesForWindowSize);
    }
    this.elementsLoaded = false;
    this.widgetDisabled = false;
    this.onHelpLoaded = undefined;
    this.currentHelpKey = undefined;
    this.helpUpdateCallback = undefined;
    this.getCurrentHelpKey = () => this.currentHelpKey || this.defaultHelpKey;
    this.defaultHelpKey = 'default.html';
    this.isSetForMobile = undefined;
    this.config = undefined;
    this.loadCalled = false;
  }

  public load(config: HelpConfig) {
    if (this.loadCalled) {
      return;
    }

    this.config = (this.isOmnibarMimickingDisabled(config)) ? mergeConfig(config) : config;
    this.init();

    return this.ready()
      .then(() => {
        this.loadCalled = true;
        if (this.config.defaultHelpKey !== undefined) {
          this.defaultHelpKey = config.defaultHelpKey;
        }

        // TODO move to mergeConfig
        this.config.hostQueryParams = this.getQueryParams();

        if (this.config.getCurrentHelpKey !== undefined) {
          this.getCurrentHelpKey = this.config.getCurrentHelpKey;
          delete this.config.getCurrentHelpKey;
        }

        if (this.config.onHelpLoaded !== undefined) {
          this.onHelpLoaded = this.config.onHelpLoaded;
          delete this.config.onHelpLoaded;
        }

        if (this.config.helpUpdateCallback !== undefined) {
          this.helpUpdateCallback = this.config.helpUpdateCallback;
          delete this.config.helpUpdateCallback;
        }

        this.sanitizeConfig();
        if (this.isOmnibarMimickingEnabled()) {
          // sending the config will result is a response "Config Loaded" message that will trigger onHelpLoaded,
          // thus no need to do it here
          this.sendConfig();
        } else if (this.onHelpLoaded) {
          this.onHelpLoaded();
        }
      });
  }

  /**
   * This does nothing when {@link HelpConfig#helpMode} is menu.
   * Instead of using this method, enter menu mode.
   * @deprecated
   */
  public close() {
    if (this.isOmnibarMimickingEnabled()) {
      // Wait for client close transition to finish to send close message to SPA
      setTimeout(() => {
        this.communicationService.postMessage({
          messageType: 'help-widget-closed'
        });
      }, 300);
      this.container.classList.add(HELP_CLOSED_CLASS);
      this.invoker.setAttribute('aria-pressed', 'false');
      this.invoker.setAttribute('aria-expanded', 'false');
    }
  }

  public open(helpKey: string = this.getHelpKey()) {
    if (this.widgetDisabled) {
      return;
    }
    if (this.isOmnibarMimickingEnabled()) {
      this.communicationService.postMessage({
        helpKey,
        messageType: 'open-to-help-key'
      });

      this.container.classList.remove(HELP_CLOSED_CLASS);
      this.invoker.setAttribute('aria-pressed', 'true');
      this.invoker.setAttribute('aria-expanded', 'true');
      this.invoker.focus();
    } else {
      window.open(this.buildCurrentUrl(helpKey), '_blank');
    }
  }

  /**
   * This only opens anything when {@link HelpConfig#helpMode} is legacy.
   * Instead of using this method, enter menu mode and use {@link BBHelpHelpWidget#open} directly instead.
   * @deprecated
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
    if (this.isOmnibarMimickingEnabled()) {
      this.communicationService.postMessage({
        helpKey,
        messageType: 'update-current-help-key'
      });
    } else if (this.helpUpdateCallback) {
      this.helpUpdateCallback({ url: this.buildCurrentUrl(helpKey) });
    }
  }

  public setHelpKeyToDefault(): void {
    this.setCurrentHelpKey(this.defaultHelpKey);
  }

  public disableWidget(): void {
    this.widgetDisabled = true;
    this.close();
    if (this.isOmnibarMimickingEnabled()) {
      this.invoker.classList.add('bb-help-hidden');
      this.container.classList.add('bb-help-hidden');
    }
  }

  public enableWidget(): void {
    this.widgetDisabled = false;
    if (this.isOmnibarMimickingEnabled()) {
      this.invoker.classList.remove('bb-help-hidden');
      this.container.classList.remove('bb-help-hidden');
    }
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
   * This isn't needed when {@link HelpConfig#helpMode} is menu.
   * Instead of using this method, enter menu mode.
   * @deprecated
   */
  private widgetReady() {
    return new Promise<void>((resolve, reject) => {
      let readyAttempts = 0;
      const duration: number = 100;

      const interval = setInterval(() => {
        readyAttempts++;
        if (this.elementsLoaded) {
          clearInterval(interval);
          resolve();
        }

        if (readyAttempts >= this.maxReadyChecks) {
          clearInterval(interval);
          reject('The Help Widget failed to load.');
        }
      }, duration);
    });
  }

  /**
   * This isn't needed when {@link HelpConfig#helpMode} is menu.
   * Instead of using this method, enter menu mode.
   * @deprecated
   */
  private setUpCommunication() {
    this.communicationService.bindChildWindowReference(this.iframe);
    this.communicationService.setListener((action: CommunicationAction) => {
      this.actionResponse(action);
    });
  }

  /**
   * This isn't needed when {@link HelpConfig#helpMode} is menu.
   * Instead of using this method, enter menu mode.
   * @deprecated
   */
  private actionResponse(action: CommunicationAction) {
    switch (action.messageType) {
      case 'Close Widget':
        this.invoker.focus();
        this.close();
        break;
        case 'Open Widget':
          this.invoker.focus();
          this.open(action.helpKey);
          break;
      case 'Child Window Ready':
        if (this.loadCalled) {
          this.sendConfig();
        }
        break;
      case 'Config Loaded':
        const configData = JSON.parse(action.data);
        this.updateConfigKeys(configData);
        this.renderInvoker();
        if (this.onHelpLoaded) {
          this.onHelpLoaded();
        }
        break;
      default:
        console.error(`No matching response for action: ${action.messageType}`);
    }
  }

  /**
   * This isn't needed when {@link HelpConfig#helpMode} is menu.
   * Instead of using this method, enter menu mode.
   * @deprecated
   */
  private updateConfigKeys(configOptions: any) {
    this.config = configOptions;
    if (configOptions.defaultHelpKey) {
      this.defaultHelpKey = configOptions.defaultHelpKey;
    }
  }

  private getQueryParams(): string {
    const results = window.location.search;
    return results;
  }

  /**
   * This isn't needed when {@link HelpConfig#helpMode} is menu.
   * Instead of using this method, enter menu mode.
   * @deprecated
   */
  private sendConfig() {
    this.communicationService.postMessage({
      config: this.config,
      messageType: 'user-config'
    });
  }

  /**
   * This isn't needed when {@link HelpConfig#helpMode} is menu.
   * Instead of using this method, enter menu mode.
   * @deprecated
   */
  private renderInvoker() {
    this.widgetRenderer.addInvokerStyles(this.invoker, this.config);
    this.container.insertBefore(this.invoker, this.iframe);
  }

  /**
   * This isn't needed when {@link HelpConfig#helpMode} is menu.
   * Instead of using this method, enter menu mode.
   * @deprecated
   */
  private createElements() {
    this.container = this.widgetRenderer.createContainer();
    this.invoker = this.widgetRenderer.createInvoker();
    this.iframe = this.widgetRenderer.createIframe();
    this.elementsLoaded = true;
  }

  /**
   * This isn't needed when {@link HelpConfig#helpMode} is menu.
   * Instead of using this method, enter menu mode.
   * @deprecated
   */
  private renderElements() {
    this.setClassesForWindowSize();
    this.widgetRenderer.appendElement(this.container);
    this.widgetRenderer.appendElement(this.iframe, this.container);
  }

  /**
   * This isn't needed when {@link HelpConfig#helpMode} is menu.
   * Instead of using this method, enter menu mode.
   * @deprecated
   */
  private setUpInvokerEvents() {
    this.invoker.addEventListener('click', () => {
      this.toggleOpen();
    });
  }

  /**
   * The concept of collapsing isn't relevant when {@link HelpConfig#helpMode} is menu.
   * Thus the widget is effectively always collapsed in that state.
   * @deprecated
   */
  private isCollapsed() {
    return this.isOmnibarMimickingDisabled() || this.container.classList.contains(HELP_CLOSED_CLASS);
  }

  /**
   * This isn't needed when {@link HelpConfig#helpMode} is menu.
   * Instead of using this method, enter menu mode.
   * @deprecated
   */
  private setClassesForWindowSize = () => {
    this.container.classList.add(DISABLE_TRANSITION);

    if (this.isSetForMobile !== true && (this.isMobileWidth() || this.isMobileHeight())) {
      this.isSetForMobile = true;
      this.container.classList.add(MOBILE_CONTAINER_CLASS);
    }

    if (this.isSetForMobile !== false && !this.isMobileWidth() && !this.isMobileHeight()) {
      this.isSetForMobile = false;
      this.container.classList.remove(MOBILE_CONTAINER_CLASS);
    }

    /**
     * This is to trigger a reflow, and flush the CSS changes with the class switch cached by the browser.
     * http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html
     * https://stackoverflow.com/q/11131875/10070672
     */
    // tslint:disable-next-line
    this.container.offsetWidth;
    this.container.classList.remove(DISABLE_TRANSITION);
  }

  /**
   * This isn't needed when {@link HelpConfig#helpMode} is menu.
   * Instead of using this method, enter menu mode.
   * @deprecated
   */
  private isMobileWidth(): boolean {
    if (window.innerWidth <= SCREEN_XS_MAX) {
      if (!this.invoker.classList.contains(MOBILE_WIDTH_CLASS)) {
        this.invoker.classList.add(MOBILE_WIDTH_CLASS);
      }
      return true;
    }

    if (this.invoker.classList.contains(MOBILE_WIDTH_CLASS)) {
      this.invoker.classList.remove(MOBILE_WIDTH_CLASS);
    }

    return false;
  }

  /**
   * This isn't needed when {@link HelpConfig#helpMode} is menu.
   * Instead of using this method, enter menu mode.
   * @deprecated
   */
  private isMobileHeight(): boolean {
    return window.innerHeight <= PANEL_HEIGHT;
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

  private sanitizeConfig() {
    this.config = JSON.parse(JSON.stringify(this.config));
  }

  /**
   * @return false iff config is defined and {@link HelpConfig#helpMode} is defined as menu.
   */
  private isOmnibarMimickingEnabled(config: HelpConfig = this.config): boolean {
    return config === undefined || config.helpMode !== 'menu';
  }

  private isOmnibarMimickingDisabled(config: HelpConfig = this.config): boolean {
    return !this.isOmnibarMimickingEnabled(config);
  }

  private buildCurrentUrl(helpKey: string): string {
    return `${this.config.helpBaseUrl}${helpKey}`;
  }
}
