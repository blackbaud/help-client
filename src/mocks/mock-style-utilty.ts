export class MockStyleUtility {
  public addAllStyles() {
    //
  }
}

export function expectNoStyleElements() {
    const elements: NodeListOf<Element> = document.head.querySelectorAll('style');
    expect(elements.length).toEqual(0);
}
