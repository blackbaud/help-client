import { BBHelpHelpWidget } from './help-widget';
import { BBHelpHelpWidgetRenderer } from './help-widget-renderer';
import { BBHelpStyleUtility } from './help-widget-style-utility';
import { BBHelpAnalyticsService } from './service/analytics.service';
import { BBHelpCommunicationService } from './service/communication.service';
import { MixpanelKeys } from './service/mixpanel-keys';

const styleUtility = new BBHelpStyleUtility();
const widgetRenderer = new BBHelpHelpWidgetRenderer();
const mixpanelKeys = new MixpanelKeys();
const analyticsService = new BBHelpAnalyticsService(mixpanelKeys);
const communicationService = new BBHelpCommunicationService();

const helpWidget = new BBHelpHelpWidget(
  widgetRenderer,
  analyticsService,
  communicationService,
  styleUtility
);

export { helpWidget as HelpWidget };
