export interface HelpConfig {
  /**
   * This does nothing when {@link HelpConfig#mimicOmnibar} is false.
   * Instead of using this property, disable omnibar mimicking.
   * @deprecated
   */
  caseCentralUrl?: string;
  /**
   * This does nothing when {@link HelpConfig#mimicOmnibar} is false.
   * Instead of using this property, disable omnibar mimicking.
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
   * This does nothing when {@link HelpConfig#mimicOmnibar} is false.
   * Instead of using this property, disable omnibar mimicking.
   * @deprecated
   */
  getChatData?: any;
  getCurrentHelpKey?: any;
  /**
   * This does nothing when {@link HelpConfig#mimicOmnibar} is false.
   * Instead of using this property, disable omnibar mimicking.
   * @deprecated
   */
  headerColor?: string;
  /**
   * This does nothing when {@link HelpConfig#mimicOmnibar} is false.
   * Instead of using this property, disable omnibar mimicking.
   * @deprecated
   */
  headerTextColor?: string;
  helpBaseUrl?: string | ((locale: string) => string);
  /**
   * This does nothing when {@link HelpConfig#mimicOmnibar} is false.
   * Instead of using this property, disable omnibar mimicking.
   * @deprecated
   */
  helpCenterUrl?: string;
  /**
   * @deprecated
   */
  hideHelpChat?: boolean | string;
  helpUpdateCallback?: (args: { url: string }) => void;
  /**
   * The undock component no longer exists, thus this configuration will have no effect.
   * @deprecated
   */
  hideUndock?: boolean | string;
  /**
   * This does nothing when {@link HelpConfig#mimicOmnibar} is false.
   * Instead of using this property, disable omnibar mimicking.
   * @deprecated
   */
  hideWidgetOnMobile?: boolean;
  /**
   * This does nothing when {@link HelpConfig#mimicOmnibar} is false.
   * Instead of using this property, disable omnibar mimicking.
   * @deprecated
   */
  knowledgebaseUrl?: string;
  locale?: string;
  /**
   * Determines if widget will attempt to mimic being in the omnibar.
   * If true (default), the widget will create a green-ear trigger in the DOM that is designed to be on top of the omnibar.
   * If false, the widget will not create any visual elements in the DOM and will open all topics in a new tab.
   * It's recommended to disable omnibar mimicking.
   */
  mimicOmnibar?: boolean;
  onHelpLoaded?: any;
  productId?: string;
  /**
   * This does nothing when {@link HelpConfig#mimicOmnibar} is false.
   * Instead of using this property, disable omnibar mimicking.
   * @deprecated
   */
  searchService?: string;
  /**
   * This does nothing when {@link HelpConfig#mimicOmnibar} is false.
   * Instead of using this property, disable omnibar mimicking.
   * @deprecated
   */
  trainingCentralUrl?: string;
  /**
   * This does nothing when {@link HelpConfig#mimicOmnibar} is false.
   * Instead of using this property, disable omnibar mimicking.
   * @deprecated
   */
  useFlareSearch?: boolean;
  /**
   * This was a proposed solution to What's new years ago that never was acted upon.
   * @deprecated
   */
  whatsNewRevisions?: any;
  hostQueryParams?: string;
  /**
   * This was a proposed solution to What's new years ago that never was acted upon.
   * @deprecated
   */
  whats_new_help_key?: string;
}
