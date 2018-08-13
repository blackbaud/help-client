export class ConfigService {
  private authEnabled: boolean;
  private config: any = {
    productId: 'bbHelpTesting'
  };

  public getConfigAttribute(configKey: string): any {
    return this.config[configKey];
  }

  public getAuthEnabled() {
    return this.authEnabled;
  }

  public setAuthEnabled(authEnabledFromConfig = true) {
    this.authEnabled = authEnabledFromConfig;
  }
}
