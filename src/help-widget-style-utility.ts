const panelHeight = '591px';
const panelWidth = '450px';
const collapsedHeaderHeight = '30px';
const containerZIndex = 9999;

const widgetCss = `
  #bb-help-container.bb-help-disable-transition {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    transition: none !important;
  }

  .bb-help-hidden {
    display: none;
  }

  #bb-help-container.bb-help-closed {
    right: -${panelWidth};
  }

  #bb-help-container {
    z-index: ${containerZIndex};
    line-height: normal;
    position: fixed;
    top: 0;
    right: 0;
    transition: right 250ms ease-in;
    height: ${panelHeight};
    width: ${panelWidth};
    box-sizing: border-box;
  }

  .bb-omnibar-collapsed #bb-help-container.bb-help-closed #bb-help-invoker:not(:hover) {
    height: ${collapsedHeaderHeight};
    border-bottom-left-radius: 25px;
    border-top-left-radius: 25px;
    width: 30px;
    padding: 2px 10px 7px 6px;
  }

  #bb-help-invoker {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom-left-radius: 25px;
    border-top-left-radius: 25px;
    border: none;
    background: #71bf44;
    color: #fff;
    position: absolute;
    cursor: pointer;
    height: 50px;
    width: 40px;
    right: 100%;
    padding-left: 10px;
    border: none;
  }

  #bb-help-invoker > span {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    font-weight: 700;
    width: 2.5ex;
    height: 2.5ex;
    font-size: 14px;
    border-radius: 100%;
    border: 2px solid;
    box-sizing: content-box;
  }

  #bb-help-iframe {
    box-shadow: -1px 2px 9px 0 rgba(50,50,50,.41);
    height: 100%;
    width: 100%;
    border: none;
  }

  .bb-help-closed #bb-help-iframe {
    box-shadow: none;
  }
`;

const omnibarCss = `
  .bb-omnibar-bar.bar {
    padding-right: 50px !important;
  }

  .bb-omnibar .bb-omnibar-desktop .bb-omnibar-accountflyout {
    right: 50px !important;
  }
`;

const mobileCss = `
  .bb-help-container-mobile#bb-help-container {
    height: 100%;
    width: 100%;
  }

  .bb-help-container-mobile#bb-help-container.bb-help-closed {
    right: -100%;
  }

  .bb-help-container-mobile#bb-help-container #bb-help-invoker.bb-help-mobile-width.bb-help-hide-on-mobile {
    display: none;
  }
`;

export class BBHelpStyleUtility {

  private stylesLoaded: boolean = false;

  public addAllStyles() {
    if (this.stylesLoaded) {
      return;
    }
    this.addCssToHead(widgetCss);
    this.addCssToHead(omnibarCss);
    this.addCssToHead(mobileCss);
    this.stylesLoaded = true;
  }

  public addCssToHead(css: string) {
    const styleEl = document.createElement('style');

    styleEl.appendChild(document.createTextNode(css));

    document.head.appendChild(styleEl);

    return styleEl;
  }
}
