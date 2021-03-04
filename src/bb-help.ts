import { BBHelpHelpWidget } from './help-widget';
import { BBHelpHelpWidgetRenderer } from './help-widget-renderer';
import { BBHelpStyleUtility } from './help-widget-style-utility';

const styleUtility = new BBHelpStyleUtility();
const widgetRenderer = new BBHelpHelpWidgetRenderer();

const helpWidget = new BBHelpHelpWidget(widgetRenderer, styleUtility);

export { helpWidget as HelpWidget };
