import { HelpConfig } from './help-config';
import { BBHelpHelpWidgetRenderer } from './help-widget-renderer';
import { BBHelpStyleUtility } from './help-widget-style-utility';
import { mergeConfig } from './service/config-merge.utils';

const MOBILE_CONTAINER_CLASS: string = 'bb-help-container-mobile';
const DISABLE_TRANSITION: string = 'bb-help-disable-transition';
const MOBILE_WIDTH_CLASS: string = 'bb-help-mobile-width';
const SCREEN_XS_MAX: number = 767;
const PANEL_HEIGHT: number = 591;

export class BBHelpHelpWidget {
  public config: HelpConfig;
  public currentHelpKey: string;
  public onHelpLoaded: any;
  private container: HTMLElement;
  private invoker: HTMLElement;
  private menu: HTMLElement;
  private elementsLoaded: boolean = false;
  private widgetDisabled: boolean = false;
  private defaultHelpKey: string = 'default.html';
  private loadCalled: boolean = false;
  private isSetForMobile: boolean;
  private resizeEventListener: () => void;

  constructor(private widgetRenderer: BBHelpHelpWidgetRenderer, private styleUtility: BBHelpStyleUtility) {
  }

  public init() {
    this.styleUtility.addAllStyles();
    this.createElements();
    this.setUpInvokerEvents();
    this.renderElements();
    this.resizeEventListener = () => this.setClassesForWindowSize();
    window.addEventListener('resize', this.resizeEventListener);
  }

  public ready() {
    return this.widgetReady().catch((err: string) => console.error(err));
  }

  public unload(): void {
    if (!this.loadCalled) {
      return;
    }
    this.container.remove();
    this.onHelpLoaded = undefined;
    this.currentHelpKey = undefined;
    this.getCurrentHelpKey = () => this.currentHelpKey || this.defaultHelpKey;
    this.defaultHelpKey = 'default.html';
    this.config = undefined;
    this.loadCalled = false;
    window.removeEventListener('resize', this.resizeEventListener);
  }

  public load(config: HelpConfig, location: Location = window.location) {
    if (this.loadCalled) {
      return;
    }

    this.init();

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

        this.renderInvoker(location);
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
      this.invoker.focus();
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
    const anchor: HTMLAnchorElement = this.menu.querySelector('a.bb-help-content-link');
    anchor.href = `${this.config.helpBaseUrl}${helpKey}`;
  }

  public setHelpKeyToDefault(): void {
    this.setCurrentHelpKey(this.defaultHelpKey);
  }

  public disableWidget(): void {
    this.widgetDisabled = true;
    this.close();
    this.invoker.classList.add('bb-help-hidden');
    this.container.classList.add('bb-help-hidden');
  }

  public enableWidget(): void {
    this.widgetDisabled = false;
    this.invoker.classList.remove('bb-help-hidden');
    this.container.classList.remove('bb-help-hidden');
  }

  /**
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

  private widgetReady() {
    return new Promise((resolve, reject) => {
      let readyAttempts = 0;
      const duration: number = 100;
      const maxIterations: number = 50;

      const interval = setInterval(() => {
        readyAttempts++;
        if (this.elementsLoaded) {
          clearInterval(interval);
          resolve();
        }

        if (readyAttempts >= maxIterations) {
          clearInterval(interval);
          reject('The Help Widget failed to load.');
        }
      }, duration);
    });
  }

  private renderInvoker(location: Location) {
    this.widgetRenderer.addInvokerStyles(this.invoker, this.config);
    const contentUrl = `${this.config.helpBaseUrl}${this.getHelpKey()}`;
    this.menu = this.widgetRenderer.createMenu(contentUrl, this.config.whatsNewConfig, location);
    this.setUpMenuEvents();
    this.container.appendChild(this.invoker);
    this.container.appendChild(this.menu);
  }

  private createElements() {
    this.container = this.widgetRenderer.createContainer();
    this.invoker = this.widgetRenderer.createInvoker();
    this.elementsLoaded = true;
  }

  private renderElements() {
    this.setClassesForWindowSize();
    this.widgetRenderer.appendElement(this.container);
  }

  private setUpInvokerEvents() {
    this.invoker.addEventListener('click', () => {
      if (this.isMenuCollapsed()) {
        this.expandMenu(true);
      } else {
        this.collapseMenu(true);
      }
    });
    this.invoker.addEventListener('keydown', (event: KeyboardEvent) => this.handleInvokerKeydown(event));
  }

  private setUpMenuEvents() {
    this.menu.addEventListener('focusout', (event: FocusEvent) => {
      const relatedTarget = event.relatedTarget as HTMLElement;
      // if the focus is being moved to something outside of the menu, hide the menu.
      if (!this.container.contains(relatedTarget)) {
        this.collapseMenu(false);
      }
    });
    this.menu.addEventListener('keydown', (event: KeyboardEvent) => this.handleMenuKeydown(event));
  }

  private handleInvokerKeydown(event: KeyboardEvent): void {
    switch (event.key.toLowerCase()) {
      case 'arrowdown':
      case 'arrowright':
      case 'down': // ie support
      case 'right': // ie support
        this.expandMenu(true);
        break;
      case 'arrowup':
      case 'arrowleft':
      case 'up': // ie support
      case 'left': // ie support
        this.expandMenu(false);
        break;
      default:
        break;
    }
  }

  private handleMenuKeydown(event: KeyboardEvent): void {
    switch (event.key.toLowerCase()) {
      case 'escape':
      case 'esc': // ie support
      case 'tab':
        this.collapseMenu(true);
        break;
      case 'arrowdown':
      case 'arrowright':
      case 'down': // ie support
      case 'right': // ie support
        this.focusOnNextMenuItem();
        break;
      case 'arrowup':
      case 'arrowleft':
      case 'up': // ie support
      case 'left': // ie support
        this.focusOnPreviousMenuItem();
        break;
      default:
        break;
    }
  }

  private focusOnPreviousMenuItem() {
    if (this.menu.contains(document.activeElement)) {
      let prevElement = document.activeElement.previousElementSibling as HTMLElement;
      if (prevElement) {
        // skip the separator
        if (prevElement.classList.contains('help-menu-separator')) {
          prevElement = prevElement.previousElementSibling as HTMLElement;
        }
        prevElement.focus();
      } else {
        (this.menu.lastElementChild as HTMLElement).focus();
      }
    }
  }

  private focusOnNextMenuItem() {
    if (this.menu.contains(document.activeElement)) {
      let nextElement = document.activeElement.nextElementSibling as HTMLElement;
      if (nextElement) {
        // skip the separator
        if (nextElement.classList.contains('help-menu-separator')) {
          nextElement = nextElement.nextElementSibling as HTMLElement;
        }
        nextElement.focus();
      } else {
        (this.menu.firstElementChild as HTMLElement).focus();
      }
    }
  }

  /**
   * @deprecated widget no longer expands, thus it is always collapsed in the original definition of the function.
   */
  private isCollapsed() {
    return true;
  }

  private isMenuCollapsed(): boolean {
    return this.menu.classList.contains('help-menu-collapse');
  }

  private expandMenu(focusOnFirst: boolean): void {
    this.menu.classList.remove('help-menu-collapse');
    this.invoker.classList.add('bb-help-active');
    this.container.classList.add('bb-help-active');
    if (focusOnFirst) {
      (this.menu.firstElementChild as HTMLElement).focus();
    } else {
      (this.menu.lastElementChild as HTMLElement).focus();
    }
  }

  private collapseMenu(focusOnInvoker: boolean): void {
    this.menu.classList.add('help-menu-collapse');
    this.invoker.classList.remove('bb-help-active');
    this.container.classList.remove('bb-help-active');
    if (focusOnInvoker) {
      this.invoker.focus();
    }
  }

  private setClassesForWindowSize() {
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
}
