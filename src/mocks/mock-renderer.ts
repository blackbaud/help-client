export class MockWidgetRenderer {

  public createContainer() {
    const container = document.createElement('div');
    container.classList.add('bb-help-closed');
    return container;
  }

  public createInvoker() {
    return document.createElement('button');
  }

  public createIframe() {
    return document.createElement('iframe');
  }

  public addInvokerStyles() {
    //
  }

  public appendElement(el: HTMLElement, parentEl: HTMLElement = document.body) {
    parentEl.appendChild(el);
  }
}
