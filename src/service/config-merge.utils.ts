import { HelpConfig } from '../help-config';
import { CONFIG_STORE, VALID_CONFIG_ID } from './config-store';

const FALLBACK_LOCALE = 'en-us';
const FALLBACK_BASE_URL_ROOT = 'https://www.blackbaud.com/files/support/helpfiles';

// previously BBHelpWidgetConfigService.loadConfig
export function mergeConfig(config: HelpConfig): HelpConfig {
  const calculatedConfig: HelpConfig = mergeWithStoredConfig(config);
  calculatedConfig.environmentId = calculatedConfig.environmentId || getQueryParameterValue(calculatedConfig, 'envid');
  if (calculatedConfig.customLocales) {
    calculatedConfig.customLocales = calculatedConfig.customLocales.map(l => l.toLowerCase());
  }
  calculatedConfig.locale = calculateLocale(calculatedConfig);
  calculatedConfig.helpBaseUrl = formatBaseUrl(calculatedConfig);
  return calculatedConfig;
}

function mergeWithStoredConfig(config: HelpConfig) {
  const givenConfig: HelpConfig = Object.assign({}, config);
  const storedConfig: HelpConfig = CONFIG_STORE[config.extends as VALID_CONFIG_ID];
  if (storedConfig) {
    if (givenConfig.customLocales && storedConfig.customLocales && givenConfig.customLocales.length === 0) {
      givenConfig.customLocales = storedConfig.customLocales;
    }
    return Object.assign({}, storedConfig, givenConfig);
  }
  return givenConfig;
}

function formatBaseUrl(config: HelpConfig): string {
  let url: string;
  if (typeof config.helpBaseUrl === 'string') {
    url = config.helpBaseUrl;
  } else if (typeof config.helpBaseUrl === 'function') {
    url = config.helpBaseUrl(config.locale);
  } else {
    url = fallbackBaseUrl(config);
  }
  return appendSlash(url);
}

function fallbackBaseUrl(config: HelpConfig): string {
  return config.locale === 'en-us'
    ? `${FALLBACK_BASE_URL_ROOT}/${config.productId}/content/`
    : `${FALLBACK_BASE_URL_ROOT}/${config.productId}/content/${config.locale}/content/`;
}

function appendSlash(input: string): string {
  if (input[input.length - 1] !== '/') {
    return `${input}/`;
  }
  return input;
}

function calculateLocale(config: HelpConfig): string {
  const localeQueryParamValue: string = getQueryParameterValue(config, 'helplocale');
  const locale = (localeQueryParamValue || config.locale || FALLBACK_LOCALE).toLowerCase();
  const partialLocale = locale.split('-')[0];

  if (config.customLocales) {
    if (config.customLocales.indexOf(locale) > -1) {
      return locale;
    } else if (config.customLocales.indexOf(partialLocale) > -1) {
      return partialLocale;
    }
  }
  return FALLBACK_LOCALE;
}

/**
 * retrieve query param values from HelpConfig#hostQueryParams.
 * location.search is used as fallback.
 */
function getQueryParameterValue(config: HelpConfig, key: string): string {
  const params: string = config.hostQueryParams || window.location.search;
  const queryParam: string = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex: RegExp = new RegExp(`[?&]${queryParam}=([^&#]*)`);
  const results: RegExpExecArray = regex.exec(params);
  return !!results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : undefined;
}
