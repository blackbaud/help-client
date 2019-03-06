import { Subject } from 'rxjs';

export class MockCommunicationService {

  public communicationAction: Subject<any> = new Subject();

  public childWindow: HTMLIFrameElement;

  public childWindowReady: boolean = false;

  public bindChildWindowReference() {
    //
  }

  public ready() {
    //
  }

  public messageHandler() {
    //
  }

  public isFromHelpWidget() {
    //
  }

  public postMessage() {
    //
  }
}
