const panelHeight = '45px';
const panelWidth = '50px';
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
    top: 5px;
    right: 0;
    transition: right 250ms ease-in;
    height: ${panelHeight};
    width: ${panelWidth};
    box-sizing: border-box;
    padding: 0px;   /* this is here to override the padding that auth-client applies */
  }

  .bb-omnibar-collapsed #bb-help-container.bb-help-closed #bb-help-invoker:not(:hover) {
    height: ${collapsedHeaderHeight};
    width: 30px;
    padding: 2px 10px 7px 6px;
  }

  #bb-help-invoker {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background-color: transparent;
    color: #fff;
    cursor: pointer;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background-clip: padding-box;
  }

  body.sky-theme-modern > #bb-help-container > #bb-help-invoker {
    color: #212327;
  }

  #bb-help-invoker:hover, #bb-help-invoker:focus, #bb-help-invoker:active, #bb-help-invoker.bb-help-active {
    background-color: #35393e;
    border-top: 5px solid rgba(0,0,0,.3);
    height: 50px;
    margin-top: -5px;
  }

  body.sky-theme-modern > #bb-help-container > #bb-help-invoker:hover {
    background-color: #fff;
    border-top: none;
    border-bottom: solid 1px #00b4f1;
    height: 46px;
    margin-top: 0;
    outline: none;
  }

  body.sky-theme-modern > #bb-help-container > #bb-help-invoker:not(:active):focus {
    border: solid 2px #1870b8;
    background-color: #fff;
    height: 45px;
    margin-top: 0;
    outline: none;
  }

  body.sky-theme-modern > #bb-help-container > #bb-help-invoker:active,
  body.sky-theme-modern > #bb-help-container > #bb-help-invoker.bb-help-active {
    border: none;
    background-color: #fff;
    height: 45px;
    margin-top: 0;
    outline: none;
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,.3);
  }

  body.sky-theme-modern > #bb-help-container > #bb-help-invoker:active:after,
  body.sky-theme-modern > #bb-help-container > #bb-help-invoker.bb-help-active:after {
    position: absolute;
    height: 4px;
    top: 41px;
    left: 0;
    width: 100%;
    content: '';
  }

  body.sky-theme-modern > #bb-help-container > #bb-help-invoker:active:after {
    background-color: #00b4f1;
  }

  body.sky-theme-modern > #bb-help-container > #bb-help-invoker.bb-help-active:after {
    background-color: #fff;
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

  .help-menu {
    position: absolute;
    top: 45px;
    right: 0;
    min-width: 200px;
    background-color: #35393e;
    padding: 6px 0;
  }

  body.sky-theme-modern > #bb-help-container > .help-menu {
    background-color: #fff;
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,.3);
  }

  .help-menu-item {
    border: none;
    display: block;
    min-width: 160px;
    text-align: left;
    color: white;
    cursor: pointer;
    padding: 15px;
    width: 100%;
    background-color: transparent;
  }

  .help-menu-item:hover, .help-menu-item:focus {
    background-color: #4d5259;
    text-decoration: none;
  }

  body.sky-theme-modern > #bb-help-container > .help-menu > .help-menu-item {
    color: #212327;
    background-color: #fff;
    position: relative;
    outline: none;
  }

  body.sky-theme-modern > #bb-help-container > .help-menu > .help-menu-item:active:before,
  body.sky-theme-modern > #bb-help-container > .help-menu > .help-menu-item:not(:focus):hover:before {
    position: absolute;
    background-color: #00b4f1;
    height: 100%;
    top: 0;
    left: 0;
    content: '';
  }
  body.sky-theme-modern > #bb-help-container > .help-menu > .help-menu-item:not(:focus):hover:before {
    width: 1px;
  }

  body.sky-theme-modern > #bb-help-container > .help-menu > .help-menu-item:active:before {
    width: 4px;
  }

  body.sky-theme-modern > #bb-help-container > .help-menu > .help-menu-item:not(:active):focus {
    width: 100%;
    height: 100%;
    padding: 13px;
    border: solid 2px #1870b8;
    outline: none;
  }

  .help-menu-separator {
    border-top: solid 1px #8b919b;
  }

  .help-menu-collapse {
    display: none
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

  .bb-help-mobile-width.bb-help-hide-on-mobile#bb-help-invoker {
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
