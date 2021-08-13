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
  helpUpdateCallback?: (args: { url: string }) => void;
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
  /**
   * Version 0 (the default) refers to the legacy, green-ear style of widget.
   * Version 5 refers to a menu-based style of widget that is controlled by omnibar.
   * This version is the version expected to be used by apps that are SKY UX 5 or greater.
   */
  version?: 0 | 5;
}
