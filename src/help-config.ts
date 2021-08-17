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
  /**
   * Determines if widget will attempt to mimic being in the omnibar.
   * If true (default), the widget will create a green-ear trigger in the DOM that is designed to be on top of the omnibar.
   * If false, the widget will not create any visual elements in the DOM and will open all topics in a new tab.
   * It's recommended to disable omnibar mimicking.
   */
  mimicOmnibar?: boolean;
}
