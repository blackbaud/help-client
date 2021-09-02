# @blackbaud/help-client

[![npm](https://img.shields.io/npm/v/@blackbaud/help-client.svg)](https://www.npmjs.com/package/@blackbaud/help-client)
[![status](https://dev.azure.com/blackbaud/Products/_apis/build/status/help-client?branchName=master)](https://dev.azure.com/blackbaud/Products/_build/latest?definitionId=5831&branchName=master)

Provides a client-side library for interacting with the Help Widget. This module is a dependency of [@skyux-sdk/builder] and [@blackbaud/skyux-lib-help].

## SKYUX usage

```json
{
  "help": {
    "helpMode": "menu"
  }
}
```

```typescript
// inside a consumer's typescript code
BBHELP.HelpWidget.open('foo.html');
```
See [help-config.ts] for more configuration properties.

## Menu mode
When `helpMode` is `menu`, the expectation is that `@blackbaud-internal/skyux-spa-omnibar` will control the omnipresent trigger, not `help-client`. As a result, `help-client` will _not_ display any visual elements for triggering the widget. The omnibar will build out visual elements in a menu design instead. Any usage of `BBHELP.HelpWidget#open` will result in opening the topic in a new tab.

> `menu` is the recommended mode for any consumers.

## Legacy mode
When `helpMode` is `legacy`, `help-client` adds a trigger to the DOM that is meant to mimic `@blackbaud-internal/skyux-spa-omnibar` and places an omnipresent trigger _on top_ of the omnibar. All usages of `BBHELP.HelpWidget` will expand that trigger to display the desired topic in a help widget.

[@skyux-sdk/builder]: https://github.com/blackbaud/skyux-sdk-builder
[@blackbaud/skyux-lib-help]: https://github.com/blackbaud/skyux-lib-help
[help-config.ts]: src/help-config.ts
