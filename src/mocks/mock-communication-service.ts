import { Subject } from 'rxjs';
import { BBHelpCommunicationService } from '../service/communication.service';

export class MockCommunicationService {

  public commReadyStatus: any = Promise.resolve();

  public communicationAction: Subject<any> = new Subject();

  public childWindow: HTMLIFrameElement;

  public childWindowReady: boolean = false;

  public bindChildWindowReference() {
    //
  }

  public ready() {
    return this.commReadyStatus;
  }

  public unload() {

  }

  public postMessage() {
    //
  }
}

export type Spied<T> = {
  [func in keyof T]: jasmine.Spy;
};

export function createCommSvcSpy(): Spied<BBHelpCommunicationService> {
  return jasmine.createSpyObj(
    'BBHelpCommunicationService',
    ['bindChildWindowReference', 'ready', 'isFromHelpWidget', 'postMessage', 'unload']
  );
}

export function expectNoCommCalls(commSvcSpy: Spied<BBHelpCommunicationService>) {
  expect(commSvcSpy.bindChildWindowReference).not.toHaveBeenCalled();
  expect(commSvcSpy.ready).not.toHaveBeenCalled();
  expect(commSvcSpy.isFromHelpWidget).not.toHaveBeenCalled();
  expect(commSvcSpy.postMessage).not.toHaveBeenCalled();
}
