import { MixpanelKeys } from './mixpanel-keys';

const CAMEL_TO_TITLE_CASE_REGEX = new RegExp(/([A-Z](?=[A-Z][a-z])|[^A-Z](?=[A-Z])|[a-zA-Z](?=[^a-zA-Z])(?!\)))/g);
const HOST_NAME_REGEX = new RegExp('localhost');
const PRODUCT_NAME = 'bb_help_widget';
const DEFAULT_CONFIG = {
  persistence: 'localStorage',
  protocol: 'https'
};

let PRODUCTION_KEY: string;
let DEVELOPMENT_KEY: string;

function getWindow(): any {
  return window;
}

export class BBHelpAnalyticsService {
  private superProperties: any;
  private analyticsClient: any;
  private windowRef: any =  getWindow();

  constructor(mixpanelKeys: MixpanelKeys) {
    PRODUCTION_KEY = mixpanelKeys.PRODUCTION_KEY;
    DEVELOPMENT_KEY = mixpanelKeys.DEVELOPMENT_KEY;
  }

  public setupMixpanel(productId: string) {
    this.setAnalyticsClient(this.getMixpanel());
    this.initMixpanel();
    this.setSuperProperties({
      'Referring Service Name': productId
    });
    this.setupAnalyticsClient();
  }

  public trackEvent(eventName: string, payload: any) {
    Object.keys(payload)
      .forEach((property) => {
        const titleCasePropertyName = this.camelToTitleCase(property);
        if (titleCasePropertyName !== property) {
          payload[titleCasePropertyName] = payload[property];
          delete payload[property];
        }
      });

    this.getAnalyticsClient().bb_help_widget.track(eventName, payload);
  }

  private getSuperProperties() {
    return this.superProperties;
  }

  private setSuperProperties(props: any) {
    this.superProperties = props;
  }

  private getAnalyticsClient() {
    return this.analyticsClient;
  }

  private setAnalyticsClient(client: any) {
    this.analyticsClient = client;
  }

  // Converts 'pageName' to 'Page Name', and doesn't mangle properties like 'Duration (s)'.
  private camelToTitleCase(oldString: string) {
    return oldString.replace(/ /g, '')
      .replace(CAMEL_TO_TITLE_CASE_REGEX, '$1 ')
      .replace(/^./, (match) => {
        return match.toUpperCase();
      });
  }

  private getMixpanel() {
    return require('mixpanel-browser');
  }

  private initMixpanel() {
    const MIXPANEL_KEY = this.isDevelopment() ? DEVELOPMENT_KEY : PRODUCTION_KEY;
    this.getAnalyticsClient().init(MIXPANEL_KEY, DEFAULT_CONFIG, PRODUCT_NAME);
  }

  private isDevelopment() {
    // Converts the returned value to a boolean. Returns true if localhost or SKY_PAGES_DEV_INFO exists.
    return (!!this.windowRef.location.hostname.match(HOST_NAME_REGEX) || !!this.windowRef.SKY_PAGES_DEV_INFO);
  }

  private setupAnalyticsClient() {
    this.registerSuperProperties();
  }

  private registerSuperProperties() {
    this.getAnalyticsClient().bb_help_widget.register(this.getSuperProperties());
  }
}
