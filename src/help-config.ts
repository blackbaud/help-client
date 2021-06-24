export interface WhatsNewConfig {
  url: string;
  newTab: boolean;
}

export interface HelpConfig {
  /**
   * @deprecated
   */
  caseCentralUrl?: string;
  /**
   * @deprecated
   */
  communityUrl?: string;
  customLocales?: string[];
  defaultHelpKey?: string;
  /**
   * @deprecated
   */
  entitlements?: {
    [key: string]: boolean;
  };
  /**
   * @deprecated
   */
  environmentId?: string;
  extends?: string;
  /**
   * @deprecated
   */
  getChatData?: any;
  getCurrentHelpKey?: any;
  headerColor?: string;
  headerTextColor?: string;
  helpBaseUrl?: string | ((locale: string) => string);
  /**
   * @deprecated
   */
  helpCenterUrl?: string;
  /**
   * @deprecated
   */
  hideHelpChat?: boolean | string;
  /**
   * @deprecated
   */
  hideUndock?: boolean | string;
  hideWidgetOnMobile?: boolean;
  /**
   * @deprecated
   */
  knowledgebaseUrl?: string;
  locale?: string;
  onHelpLoaded?: any;
  productId?: string;
  /**
   * @deprecated
   */
  searchService?: string;
  /**
   * @deprecated
   */
  trainingCentralUrl?: string;
  /**
   * @deprecated
   */
  useFlareSearch?: boolean;
  /**
   * @deprecated
   */
  whatsNewRevisions?: any;
  hostQueryParams?: string;
  /**
   * @deprecated
   */
  whats_new_help_key?: string;
  whatsNewConfig?: WhatsNewConfig;
}
