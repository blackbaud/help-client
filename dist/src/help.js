"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var register_script_1 = require("./register-script");
var BBHelp = (function () {
    function BBHelp() {
    }
    BBHelp.addStyles = function () {
        var css = "\n      .bb-omnibar-bar.bar { padding-right: 50px !important; }\n      .bb-omnibar > .bb-omnibar-desktop > .bb-omnibar-accountflyout { right: 50px !important; }\n      #bb-help-container { z-index: 9999; }\n    ";
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    };
    BBHelp.load = function (config) {
        if (config === void 0) { config = {}; }
        return register_script_1.registerScript('https://cdn.blackbaudcloud.com/bb-help/bb-help.js')
            .then(function () {
            BBHelp.addStyles();
            // Initialize the widget.
            BBHELP.HelpWidget.load(config);
        });
    };
    return BBHelp;
}());
exports.BBHelp = BBHelp;
//# sourceMappingURL=help.js.map