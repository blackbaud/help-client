"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerScript = function (url) {
    return new Promise(function (resolve, reject) {
        var scriptEl = document.createElement('script');
        scriptEl.onload = resolve;
        scriptEl.onerror = reject;
        scriptEl.src = url;
        document.body.appendChild(scriptEl);
    });
};
//# sourceMappingURL=register-script.js.map