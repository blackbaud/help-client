import { BBHelpStyleUtility } from './help-widget-style-utility';

describe('BBHelpStyleUtility', () => {
  let styleUtility: BBHelpStyleUtility;

  beforeEach(() => {
    styleUtility = new BBHelpStyleUtility();
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
});
