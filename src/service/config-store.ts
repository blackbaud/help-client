import { HelpConfig } from '../help-config';
import { ADMIN_CONFIG as adminConfig } from './configs/admin';
import { AWARD_MANAGEMENT_CONFIG } from './configs/award';
import { BB_HELP_CONFIG as bbHelpConfig } from './configs/bbhelp';
import { config as bulkimportConfig } from './configs/bulkimport';
import { config as churchConfig } from './configs/church';
import { config as eduConfig } from './configs/edu';
import { config as faithConfig } from './configs/faith';
import { config as feConfig } from './configs/fe';
import { config as fndliteConfig } from './configs/fndlite';
import { config as gmkConfig } from './configs/grantmaking';
import { config as marketplaceConfig } from './configs/marketplace';
import { config as rexConfig } from './configs/rex';
import { config as smallGroupsConfig } from './configs/smallgroups';
import { STEWARDSHIP_MANAGEMENT_CONFIG } from './configs/stewardship';
import { config as tcsConfig } from './configs/tcs';

export type VALID_CONFIG_ID = 'admin'
  | 'bbcrm'
  | 'bbhelp'
  | 'award-management'
  | 'stewardship-management'
  | 'chrch'
  | 'edu'
  | 'faith'
  | 'fenxt'
  | 'fenxt(fenxt.cdev)'
  | 'fenxt(fenxt.ate)'
  | 'fndlite'
  | 'marketplace'
  | 'renxt'
  | 'smallgroups'
  | 'tcs'
  | 'gmk';

export const CONFIG_STORE: { [k in VALID_CONFIG_ID]: HelpConfig } = {
  admin: adminConfig,
  'award-management': AWARD_MANAGEMENT_CONFIG,
  // This is necessary as bbcrm is using the old help format, and bulkimport is a modern SPA.
  bbcrm: bulkimportConfig,
  bbhelp: bbHelpConfig,
  chrch: churchConfig,
  edu: eduConfig,
  faith: faithConfig,
  fenxt: feConfig,
  // FE has various svcid's based on their environments for testing.
  ['fenxt(fenxt.cdev)']: feConfig,
  ['fenxt(fenxt.ate)']: feConfig,
  fndlite: fndliteConfig,
  gmk: gmkConfig,
  marketplace: marketplaceConfig,
  renxt: rexConfig,
  smallgroups: smallGroupsConfig,
  'stewardship-management': STEWARDSHIP_MANAGEMENT_CONFIG,
  tcs: tcsConfig
};
