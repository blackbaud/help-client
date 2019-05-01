import { Subject } from 'rxjs';

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

  public postMessage() {
    //
  }
}
