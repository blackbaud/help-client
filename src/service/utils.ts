import { HelpConfig } from '../help-config';

/**
 * retrieve query param values from HelpConfig#hostQueryParams.
 * location.search is used as fallback.
 */
export function getQueryParameterValue(config: HelpConfig, key: string): string {
  const params: string = config.hostQueryParams || window.location.search;
  const queryParam: string = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex: RegExp = new RegExp(`[?&]${queryParam}=([^&#]*)`);
  const results: RegExpExecArray = regex.exec(params);
  return !!results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : undefined;
}
