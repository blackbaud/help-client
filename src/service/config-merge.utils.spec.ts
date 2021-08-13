import { HelpConfig } from '../help-config';
import { OBJECT_COMPARE_MATCHERS } from '../mocks/object.compare.matcher';
import { mergeConfig } from './config-merge.utils';
import { CONFIG_STORE, VALID_CONFIG_ID } from './config-store';

describe('mergeConfig', () => {
  beforeAll(() => {
    jasmine.addMatchers(OBJECT_COMPARE_MATCHERS);
  });

  it('should extend a stored config', () => {
    const givenConfig: HelpConfig = { extends: 'renxt' };
    const storedConfig = CONFIG_STORE[givenConfig.extends as VALID_CONFIG_ID];
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig).toEqualObject(storedConfig, { excludes: ['extends', 'locale', 'helpBaseUrl'] });
    expect(mergedConfig.extends).toEqual(givenConfig.extends);
  });

  it('should overwrite any stored props existing in given config', () => {
    const givenConfig = { extends: 'renxt', productId: 'productId' };
    const storedConfig = CONFIG_STORE[givenConfig.extends as VALID_CONFIG_ID];
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig).toEqualObject(storedConfig, { excludes: ['extends', 'productId', 'locale', 'helpBaseUrl'] });
    expect(mergedConfig).toEqualObject(givenConfig, { includes: ['extends', 'productId'] });
  });

  it('should not overwrite customLocales', () => {
    const givenConfig = { extends: 'renxt', customLocales: ['en-test'] };
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig.customLocales).toEqual(givenConfig.customLocales);
  });

  it('should overwrite empty customLocales', () => {
    const givenConfig: HelpConfig = { extends: 'renxt', customLocales: [] };
    const storedConfig = CONFIG_STORE[givenConfig.extends as VALID_CONFIG_ID];
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig.customLocales).toEqual(storedConfig.customLocales);
  });

  it('should map customLocales to lowercase', () => {
    const givenConfig = { customLocales: ['en-TEST'] };
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig.customLocales).toEqual(['en-test']);
  });

  it('should not change the given locale when present in customLocales', () => {
    const givenConfig = { locale: 'en-test', customLocales: ['en-TEST'] };
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig.locale).toEqual(givenConfig.locale);
  });

  it('should use en-us as locale if given locale is not present in customLocales', () => {
    const givenConfig = { locale: 'en-test', customLocales: ['fr-test'] };
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig.locale).toEqual('en-us');
  });

  it('should use partial locale if only the partial is present customLocales', () => {
    const givenConfig = { locale: 'en-test', customLocales: ['en'] };
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig.locale).toEqual('en');
  });

  it('should use en-us as locale if none is given', () => {
    const givenConfig = {};
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig.locale).toEqual('en-us');
  });

  it('should overwrite locale if provided in query params', () => {
    const givenConfig = {
      customLocales: ['en-test', 'fr-test'],
      hostQueryParams: '?helplocale=fr-test',
      locale: 'en-test'
    };
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig.locale).toEqual('fr-test');
  });

  it('should provide fallback helpBaseUrl when nothing else provided', () => {
    const givenConfig = { productId: 'productId' };
    const expectedUrl = 'https://www.blackbaud.com/files/support/helpfiles/productId/content/';
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig.helpBaseUrl).toEqual(expectedUrl);
  });

  it('should include non-en-us locales in helpBaseUrl when provided', () => {
    const givenConfig = { productId: 'productId', locale: 'en-test', customLocales: ['en-test'] };
    const expectedUrl = 'https://www.blackbaud.com/files/support/helpfiles/productId/content/en-test/content/';
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig.helpBaseUrl).toEqual(expectedUrl);
  });

  it('should add trailing slash to any given helpBaseUrl string', () => {
    const givenConfig = { helpBaseUrl: 'http://test.io' };
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig.helpBaseUrl).toEqual('http://test.io/');
  });

  it('should add trailing slash to any given helpBaseUrl function', () => {
    const urlFunc = jasmine.createSpy('urlFunc').and.returnValue('http://test.io');
    const givenConfig = { helpBaseUrl: urlFunc, locale: 'en-test', customLocales: ['en-test'] };
    const mergedConfig = mergeConfig(givenConfig);
    expect(mergedConfig.helpBaseUrl).toEqual('http://test.io/');
    expect(urlFunc).toHaveBeenCalledWith('en-test');
  });
});
