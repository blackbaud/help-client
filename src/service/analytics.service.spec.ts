import { HelpConfig } from '../help-config';
import { BBHelpAnalyticsService } from './analytics.service';

const demoConfig: HelpConfig = {
  productId: 'bbHelpTesting'
};

describe('BBHelpAnalyticsService', () => {
  let analyticsService: BBHelpAnalyticsService;
  let originalTimeout: number;
  let mixpanelSpy: any;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    analyticsService = new BBHelpAnalyticsService();

    mixpanelSpy = spyOn<any>(analyticsService, 'getMixpanel').and.returnValue({
      bb_help_widget: {
        identify: () => { return; },
        register: (object: any) => { return; },
        track: (eventName: any, payload: any) => { return; }
      },
      init: (key: any, config: any, name: any) => { return; }
    });
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should set up the mixpanel', (done) => {
    spyOn<any>(analyticsService, 'registerSuperProperties').and.callThrough();

    analyticsService.setupMixpanel(demoConfig.productId);

    expect(analyticsService['superProperties']).toEqual({
      'Referring Service Name': 'bbHelpTesting'
    });
    expect(analyticsService['analyticsClient']).toBeDefined();
    expect(analyticsService['registerSuperProperties']).toHaveBeenCalled();
    done();
  });

  it('should set up the mixpanel with production key', (done) => {
    spyOn<any>(analyticsService, 'isDevelopment').and.returnValue(false);

    analyticsService.setupMixpanel(demoConfig.productId);

    expect(analyticsService['superProperties']).toEqual({'Referring Service Name': demoConfig.productId });
    expect(analyticsService['analyticsClient']).toBeDefined();
    done();
  });

  it('should track an event', (done) => {
    analyticsService.setupMixpanel(demoConfig.productId);
    spyOn<any>(analyticsService['getAnalyticsClient']().bb_help_widget, 'track').and.callThrough();
    const payload = { 'Data Payload' : 'payload' };
    analyticsService.setupMixpanel(demoConfig.productId);
    analyticsService.trackEvent('event', payload);

    expect(analyticsService['getAnalyticsClient']().bb_help_widget.track)
      .toHaveBeenCalledWith('event', payload);
    done();
  });

  it('should track an event with invalid payload attribute name', (done) => {
    analyticsService.setupMixpanel(demoConfig.productId);
    spyOn<any>(analyticsService['getAnalyticsClient']().bb_help_widget, 'track').and.callThrough();
    const payload = { 'payload Payload': 'payload' };
    const result = { 'Payload Payload': 'payload' };
    analyticsService.trackEvent('event', payload);

    expect(analyticsService['getAnalyticsClient']().bb_help_widget.track)
      .toHaveBeenCalledWith('event', result);
    done();
  });

  it('should get analytics client', (done) => {
    analyticsService.setupMixpanel(demoConfig.productId);
    spyOn<any>(analyticsService, 'getAnalyticsClient').and.callThrough();
    expect(analyticsService['getAnalyticsClient']()).toBeDefined();
    done();
  });

  it('should get mixpanel', (done) => {
    mixpanelSpy.and.callThrough();
    expect(analyticsService['getMixpanel']()).toBeDefined();
    done();
  });
});
