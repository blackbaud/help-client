export class MockWidgetRenderer {

  public createContainer() {
    const container = document.createElement('div');
    container.id = 'bb-help-container';
    container.classList.add('bb-help-closed');
    return container;
  }

  public createInvoker() {
    const invoker = document.createElement('button');
    invoker.id = 'bb-help-invoker';
    return invoker;
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
