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

export function expectNoBodyElements() {
    const elements: NodeListOf<Element> = document.body.querySelectorAll('*:not(script)');
    expect(elements.length).toEqual(0);
}
