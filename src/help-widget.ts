import './styles/omnibar-style-adjustments.scss';
import './styles/widget-styles.scss';

import { HelpConfig } from './help-config';
import { BBHelpHelpWidgetRenderer } from './help-widget-renderer';
import { BBHelpAnalyticsService } from './service/analytics.service';
import { BBHelpCommunicationService } from './service/communication.service';

const HELP_CLOSED_CLASS: string = 'bb-help-closed';

export class BBHelpHelpWidget {
  public iframe: HTMLIFrameElement;
  public config: HelpConfig;
  private widgetRenderer: BBHelpHelpWidgetRenderer;
  private communicationService: BBHelpCommunicationService;
  private analyticsService: BBHelpAnalyticsService;
  private container: HTMLElement;
  private invoker: HTMLElement;
  private elementsLoaded: boolean = false;
  private widgetDisabled: boolean = false;
  private defaultHelpKey: string = 'default.html';
  private currentHelpKey: string;
  private loadCalled: boolean = false;

  constructor() {
    this.widgetRenderer = new BBHelpHelpWidgetRenderer();
    this.analyticsService = new BBHelpAnalyticsService();
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
    if (this.loadCalled) {
      return;
    }

    this.analyticsService.setupMixpanel(config.productId);

    this.loadCalled = true;
    this.config = config;
    if (config.defaultHelpKey !== undefined) {
      this.defaultHelpKey = config.defaultHelpKey;
    }

    this.renderInvoker();
    this.sendConfig();
  }

  public close() {
    this.analyticsService.trackEvent('Help Widget', {
      Action: 'Closed From Invoker'
    });

    this.container.classList.add(HELP_CLOSED_CLASS);
    this.invoker.setAttribute('aria-pressed', 'false');
    this.invoker.setAttribute('aria-expanded', 'false');
  }

  public open(helpKey?: string) {
    if (!this.widgetDisabled) {
      this.communicationService.postMessage({
        messageType: 'open-to-help-key',
        helpKey
      });

      this.analyticsService.trackEvent('Help Widget', {
        Action: 'Opened From Invoker'
      });

      this.container.classList.remove(HELP_CLOSED_CLASS);
      this.invoker.setAttribute('aria-pressed', 'true');
      this.invoker.setAttribute('aria-expanded', 'true');
    }
  }

  public toggleOpen(helpKey?: string) {
    if (this.isCollapsed()) {
      this.open(helpKey);
    } else {
      this.close();
    }
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
         * Methods can not be added to the config being passed to the SPA through the communicationService.
         * The results of the Help Key need to be passed through when quereied.
         */
        this.communicationService.postMessage({
          helpKey: this.getCurrentHelpKey(),
          messageType: 'help-key'
        });
        break;
        case 'Child Window Ready':
          if (this.loadCalled) {
            this.sendConfig();
          }
          break;
        default:
          console.error(`No matching response for action: ${action}`);
    }
  }

  private sendConfig() {
    this.communicationService.postMessage({
      config: this.config,
      messageType: 'user-config'
    });
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

  private isCollapsed() {
    return this.container.classList.contains(HELP_CLOSED_CLASS);
  }
}
