import { HelpConfig } from '../help-config';
import { BBHelpAnalyticsService } from './analytics.service';

const demoConfig: HelpConfig = {
  productId: 'bbHelpTesting'
};
const DEVELOPMENT_KEY = '0e26030f769c1e630c59e1b3dec37957';
const PRODUCTION_KEY = '13c1581286213207b29bc7fc47e787e7';

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

  it('should return the production key if in production mode', (done) => {
    analyticsService['windowRef'] = {
      location: {
        hostname: 'https://production-url.com'
      }
    };
    analyticsService.setupMixpanel(demoConfig.productId);
    const returnedKey = analyticsService['getMixpanelKey']();
    expect(returnedKey).toEqual(PRODUCTION_KEY);
    done();
  });

  it('should return the development key if window.location.hostname contains localhost', (done) => {
    analyticsService['windowRef'] = {
      location: {
        hostname: 'https://localhost'
      }
    };
    analyticsService.setupMixpanel(demoConfig.productId);
    const returnedKey = analyticsService['getMixpanelKey']();
    expect(returnedKey).toEqual(DEVELOPMENT_KEY);
    done();
  });

  it('should return the development key if SKY_PAGES_DEV_INFO exists on the window', (done) => {
    analyticsService['windowRef'] = {
      SKY_PAGES_DEV_INFO: {},
      location: {
        hostname: 'https://production-url'
      }
    };

    analyticsService.setupMixpanel(demoConfig.productId);
    const returnedKey = analyticsService['getMixpanelKey']();
    expect(returnedKey).toEqual(DEVELOPMENT_KEY);
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
