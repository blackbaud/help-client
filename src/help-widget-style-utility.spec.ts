import { BBHelpStyleUtility } from './help-widget-style-utility';

describe('BBHelpStyleUtility', () => {
  let styleUtility: BBHelpStyleUtility;

  beforeEach(() => {
    styleUtility = new BBHelpStyleUtility();
  });

  afterEach(() => {
    const styleElements = document.head.querySelectorAll('style');
    styleElements.forEach(ele => ele.remove());
  });

  it('should add CSS elements to the document\'s head', () => {
    const testCss = '.test-class { color: green }';

    const styleEl = styleUtility.addCssToHead(testCss);

    expect(document.head.contains(styleEl)).toBe(true);
  });

  it('should add the stored css to the head', () => {
    spyOn(styleUtility, 'addCssToHead').and.callFake(() => { return; });

    styleUtility.addAllStyles();

    expect(styleUtility.addCssToHead).toHaveBeenCalledTimes(3);
  });

  it('should not try to load the styles once the stylesLoaded is true', () => {
    spyOn(styleUtility, 'addCssToHead').and.callFake(() => { return; });
    styleUtility['stylesLoaded'] = true;
    styleUtility.addAllStyles();
    expect(styleUtility.addCssToHead).not.toHaveBeenCalled();
  });

  it('should remove added style elements on unload', () => {
    const greenClass = '.green { color: green }';
    const redClass = '.red { color: red }';

    styleUtility.addCssToHead(greenClass);
    styleUtility.addCssToHead(redClass);
    expect(document.head.querySelectorAll('style').length).toEqual(2);
    styleUtility.removeAllStyles();
    expect(document.head.querySelectorAll('style').length).toEqual(0);
    styleUtility.addCssToHead(greenClass);
    styleUtility.addCssToHead(redClass);
    expect(document.head.querySelectorAll('style').length).toEqual(2);
  });
});
