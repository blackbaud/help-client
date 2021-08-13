import { HelpConfig } from '../../help-config';

/**
 * this is a config used for local dev. it is kept around for pure backward compatibility reasons.
 * @deprecated
 */
export const BB_HELP_CONFIG: HelpConfig = {
  productId: 'bbHelpTesting',
  locale: 'en-US',
  customLocales: ['en-US', 'es-MX'],
  headerColor: '#71bf44',
  headerTextColor: '#fff',
  trainingCentralUrl: 'https://www.blackbaud.com/trainingcentral',
  knowledgebaseUrl: 'https://kb.blackbaud.com',
  caseCentralUrl: 'https://www.blackbaud.com/casecentral/casesearch.aspx',
  helpCenterUrl: 'https://www.blackbaud.com/helpcenter',
  communityUrl: 'https://www.blackbaud.com/community',
  helpBaseUrl(locale: string) {
    if (locale) {
      return `https://www.blackbaud.com/files/support/helpfiles/bbHelpTesting/${locale}/content/`;
    }
    return 'https://www.blackbaud.com/files/support/helpfiles/bbHelpTesting/en-us/content/';
  },
  useFlareSearch: true
};
