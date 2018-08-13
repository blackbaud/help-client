import { BBAuth } from '@blackbaud/auth-client';
import { ConfigService } from './config.service';

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

export class AnalyticsService {
  public jwtDecoder: any;
  private superProperties: any;
  private analyticsClient: any;
  private decodedToken: any;
  private configService: ConfigService;

  constructor() {
    this.decodedToken = {};
    this.configService = new ConfigService();
    this.setSuperProperties({
      'Referring Service Name': this.configService.getConfigAttribute('productId')
    });
  }

  public setupMixpanel() {
    this.setAnalyticsClient(this.getMixpanel());
    this.jwtDecoder = this.getJwtDecoder();
    this.initMixpanel();
    this.setupAnalyticsClient();
  }

  public trackEvent(eventName: string, payload: any) {
    console.log(eventName);
    Object.keys(payload)
      .forEach((property) => {
        const titleCasePropertyName = this.camelToTitleCase(property);
        if (titleCasePropertyName !== property) {
          payload[titleCasePropertyName] = payload[property];
          delete payload[property];
        }
      });

    console.log('client', this.getAnalyticsClient().bb_help_widget);
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

  private getDecodedToken() {
    return this.decodedToken;
  }

  private setDecodedToken(token: any) {
    this.decodedToken = token;
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

  private getJwtDecoder() {
    return require('jwt-decode');
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
    if (this.configService.getAuthEnabled()) {
      this.registerPropertiesWithToken();
    } else {
      this.registerSuperProperties();
    }
  }

  private registerPropertiesWithToken() {
    this.getToken()
      .then((token) => {
        this.setDecodedToken(this.jwtDecoder(token));
        this.getAnalyticsClient().bb_help_widget.identify(this.getDecodedToken().sub);
        this.registerSuperProperties();
        this.registerUser();
      })
      .catch((err) => {
        // Consuming products that do not require BBAuth will have no token,
        // calling getToken returns an error.code 1 if there is BBAuth user logged in.
        if (err.code === 1) {
          this.registerSuperProperties();
        }
      });
  }

  private getToken() {
    return BBAuth.getToken({ disableRedirect: true });
  }

  private registerSuperProperties() {
    if (this.getDecodedToken().sub) {
      this.getSuperProperties()['User ID'] = this.getDecodedToken().sub;
    }
    this.getAnalyticsClient().bb_help_widget.register(this.getSuperProperties());
  }

  private registerUser() {
    this.getAnalyticsClient().bb_help_widget.people.set({
      '$email': this.getDecodedToken().email,
      '$name': this.getDecodedToken().email,
      'User ID': this.getDecodedToken().sub
    });
  }
}
