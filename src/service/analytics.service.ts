const CAMEL_TO_TITLE_CASE_REGEX = new RegExp(/([A-Z](?=[A-Z][a-z])|[^A-Z](?=[A-Z])|[a-zA-Z](?=[^a-zA-Z])(?!\)))/g);

// Default values for initializing the analytics client.
const DEVELOPMENT_KEY = '0e26030f769c1e630c59e1b3dec37957';
const PRODUCTION_KEY = '13c1581286213207b29bc7fc47e787e7';
const HOST_NAME_REGEX = new RegExp('localhost');
const PRODUCT_NAME = 'bb_help_widget';
const DEFAULT_CONFIG = {
  persistence: 'localStorage',
  protocol: 'https'
};

export class BBHelpAnalyticsService {
  private superProperties: any;
  private analyticsClient: any;

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
    const MIXPANEL_KEY = this.getMixpanelKey();
    this.getAnalyticsClient().init(MIXPANEL_KEY, DEFAULT_CONFIG, PRODUCT_NAME);
  }

  private getMixpanelKey() {
    if (this.isDevelopment()) {
      return DEVELOPMENT_KEY;
    }
    return PRODUCTION_KEY;
  }

  private isDevelopment() {
    // Converts the returned value to a boolean. If the hostname matches localhost, return true.
    return !!window.location.hostname.match(HOST_NAME_REGEX);
  }

  private setupAnalyticsClient() {
    this.registerSuperProperties();
  }

  private registerSuperProperties() {
    this.getAnalyticsClient().bb_help_widget.register(this.getSuperProperties());
  }
}
