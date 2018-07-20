require('./styles/widget-styles.scss');
require('./styles/omnibar-style-adjustments.scss');

import { BBHelpHelpWidgetRenderer } from './help-widget-renderer';
import { BBHelpCommunicationService } from './communication.service';
import { HelpConfig } from './help-config';

export class BBHelpHelpWidget {
  public iframe: HTMLIFrameElement;
  public config: HelpConfig;
  private widgetRenderer: BBHelpHelpWidgetRenderer;
  private communicationService: BBHelpCommunicationService;
  private container: HTMLElement;
  private invoker: HTMLElement;
  private elementsLoaded: boolean = false;

  private defaultHelpKey: string = 'default.html';
  private currentHelpKey: string;

  constructor() {
    this.widgetRenderer = new BBHelpHelpWidgetRenderer();
    this.createElements();
    this.setUpInvokerEvents();
    this.renderElements();
    this.setUpCommunication();
  }

  public ready() {
    return this.widgetReady()
      .then(() => {
        return this.communicationService.ready();
      })
      .catch((err: string) => {
        console.error(err);
      });
  }

  public load(config: HelpConfig) {
    return this.ready()
      .then(() => {
        this.config = config;

        if (config.defaultHelpKey !== undefined) {
          this.defaultHelpKey = config.defaultHelpKey;
        }

        this.renderInvoker();
        this.communicationService.postMessage({
          messageType: 'user-config',
          config
        });
      });
  }

  public close() {
    this.container.classList.add('bb-help-closed');
  }

  public open(helpKey?: string) {
    // open the widget to this help key
  }

  public toggleOpen() {
    this.container.classList.toggle('bb-help-closed');
  }

  public getCurrentHelpKey(): string {
    return this.currentHelpKey || this.defaultHelpKey;
  }

  public setCurrentHelpKey(helpKey: string = this.defaultHelpKey): void {
    this.currentHelpKey = helpKey;
  }

  public setHelpKeyToDefault(): void {
    this.setCurrentHelpKey(this.defaultHelpKey);
  }


  public static disableWidget(): void {
    // BBHELP.HelpWidget.disableWidget(); disable widget
  }

  public static enableWidget(): void {
    // BBHELP.HelpWidget.enableWidget(); enable widget
  }

  private widgetReady() {
    return new Promise((resolve, reject) => {
      let readyAttempts = 0;
      const duration = 100;
      const maxIterations = 100;

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

  private setUpCommunication() {
    this.communicationService = new BBHelpCommunicationService(this.iframe);
    this.communicationService.communicationAction.subscribe((action: string) => {
      this.actionResponse(action);
    });
  }

  private actionResponse(action: string) {
    switch (action) {
      case 'Close Widget':
        this.close();
        break;
      case 'Get Help Key':
        /**
         * Methods can not be added to the config being passed to the SPA through the communicationService. The results of the Help Key need to be passed through when quereied.
         */
        this.communicationService.postMessage({
          messageType: 'help-key',
          helpKey: this.getCurrentHelpKey()
        })
        break;
      default:
    }
  }

  private renderInvoker() {
    this.widgetRenderer.addInvokerStyles(this.invoker, this.config);
    this.container.insertBefore(this.invoker, this.iframe);
  }

  private createElements() {
    this.container = this.widgetRenderer.createContainer();
    this.invoker = this.widgetRenderer.createInvoker();
    this.iframe = this.widgetRenderer.createIframe();
    this.elementsLoaded = true;
  }

  private renderElements() {
    this.widgetRenderer.appendElement(this.container);
    this.widgetRenderer.appendElement(this.iframe, this.container);
  }

  private setUpInvokerEvents() {
    this.invoker.addEventListener('click', () => {
      this.toggleOpen();
    });
  }
}
