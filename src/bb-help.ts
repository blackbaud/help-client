import { BBHelpHelpWidget } from './help-widget';
import { BBHelpHelpWidgetRenderer } from './help-widget-renderer';
import { BBHelpStyleUtility } from './help-widget-style-utility';
import { BBHelpCommunicationService } from './service/communication.service';

const styleUtility = new BBHelpStyleUtility();
const widgetRenderer = new BBHelpHelpWidgetRenderer();
const communicationService = new BBHelpCommunicationService();

const helpWidget = new BBHelpHelpWidget(
  widgetRenderer,
  communicationService,
  styleUtility
);

export { helpWidget as HelpWidget };
