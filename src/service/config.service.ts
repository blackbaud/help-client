export class ConfigService {
  private config: any = {
    productId: 'bbHelpTesting'
  };

  public getConfigAttribute(configKey: string): any {
    return this.config[configKey];
  }
}
