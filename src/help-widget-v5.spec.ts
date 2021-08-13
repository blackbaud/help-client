import { HelpConfig } from './help-config';
import { BBHelpHelpWidget } from './help-widget';
import { BBHelpHelpWidgetRenderer } from './help-widget-renderer';
import { BBHelpStyleUtility } from './help-widget-style-utility';
import { createCommSvcSpy, expectNoCommCalls, Spied } from './mocks/mock-communication-service';
import { expectNoBodyElements } from './mocks/mock-renderer';
import { expectNoStyleElements } from './mocks/mock-style-utilty';
import { BBHelpCommunicationService } from './service/communication.service';
import { mergeConfig } from './service/config-merge.utils';

function noOp() {
}

describe('BBHelpHelpWidget', () => {
  describe('when configured for v5', () => {
    let helpWidget: BBHelpHelpWidget;
    let commSvcSpy: Spied<BBHelpCommunicationService>;
    let windowSpy: jasmine.Spy;
    let config: HelpConfig;

    beforeEach(() => {
      windowSpy = spyOn(window, 'open').and.callFake(noOp);
      commSvcSpy = createCommSvcSpy();
      helpWidget = new BBHelpHelpWidget(
        new BBHelpHelpWidgetRenderer(),
        commSvcSpy as any as BBHelpCommunicationService,
        new BBHelpStyleUtility()
      );
    });

    describe('with standard config', () => {
      beforeEach(async () => {
        config = { version: 5, helpBaseUrl: 'https://bb.com', defaultHelpKey: 'renxtDefault.html', extends: 'renxt' };
        await helpWidget.load(config);
      });

      it('should not render any elements to body', () => {
        expectNoBodyElements();
      });

      it('should not render any style elements to head', () => {
        expectNoStyleElements();
      });

      it('should not make any communication calls', () => {
        expectNoCommCalls(commSvcSpy);
      });

      it('should merge configs based on local config store', () => {
        const expected = mergeConfig(config);
        // TODO move to mergeConfig
        expected.hostQueryParams = '';
        // the widget sanitizes the config, so we must too for the equality check to work
        expect(helpWidget.config).toEqual(JSON.parse(JSON.stringify(expected)));
      });

      it('should do nothing on disable', () => {
        helpWidget.disableWidget();
        expectNoBodyElements();
      });

      it('should do nothing on enable', () => {
        helpWidget.enableWidget();
        expectNoBodyElements();
      });

      it('should do nothing on close', () => {
        helpWidget.close();
        expectNoCommCalls(commSvcSpy);
        expectNoBodyElements();
      });

      it('should open topic in new tab when given a help key', () => {
        const key = 'key.html';
        helpWidget.open(key);
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/key.html', '_blank');
        expectNoBodyElements();
      });

      it('should open topic in new tab when not given a help key', () => {
        helpWidget.open();
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/renxtDefault.html', '_blank');
        expectNoBodyElements();
      });

      it('should always open topic when toggled', () => {
        helpWidget.toggleOpen();
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/renxtDefault.html', '_blank');
        expectNoBodyElements();
        helpWidget.toggleOpen();
        expect(windowSpy).toHaveBeenCalledWith('https://bb.com/renxtDefault.html', '_blank');
        expectNoBodyElements();
      });
    });

    describe('with a configured onHelpLoaded', () => {
      let onHelpLoadedSpy: jasmine.Spy;

      beforeEach(async () => {
        onHelpLoadedSpy = jasmine.createSpy('onHelpLoaded');
        config = { version: 5, onHelpLoaded: onHelpLoadedSpy };
        await helpWidget.load(config);
      });

      it('should call onHelpLoaded', () => {
        expect(onHelpLoadedSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('with a configured helpUpdateCallback', () => {
      let helpUpdateCallbackSpy: jasmine.Spy;

      beforeEach(async () => {
        helpUpdateCallbackSpy = jasmine.createSpy('helpUpdateCallback');
        config = { version: 5, helpBaseUrl: 'https://bb.com', helpUpdateCallback: helpUpdateCallbackSpy };
        await helpWidget.load(config);
      });

      it('should call helpUpdateCallbackSpy when setting current help key', () => {
        const key = 'key.html';
        helpWidget.setCurrentHelpKey(key);
        expect(helpWidget.currentHelpKey).toEqual(key);
        expect(helpUpdateCallbackSpy).toHaveBeenCalledTimes(1);
        expect(helpUpdateCallbackSpy).toHaveBeenCalledWith({ url: `${config.helpBaseUrl}/${key}` });
        expectNoCommCalls(commSvcSpy);
      });
    });
  });
});
