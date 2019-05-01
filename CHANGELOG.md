# 2.0.0-beta.5 (2019-05-1)

- Official Beta release of Help Client v2.
  - Reformatted to support CDN and NPM
  - Removed Travis publish and package steps.
  - Adopted Azure npm-package-oss pipeline type in Azure.
  - Reworked to use the new [BB Help SPA](https://host.nxt.blackbaud.com/bb-help/).
  - Created a communication service to pass information between the SPA and Help Client.

# 1.3.0 (2018-04-23)

- Added an optional param to the `openWidget` method to pass a helpKey to the widget. [pull request #13](https://github.com/blackbaud/help-client/pull/13)

# 1.2.0 (2018-04-19)

- Added methods Ready, Open, Close, Disable, and Enable for the widget. [pull request #11](https://github.com/blackbaud/help-client/pull/11)

# 1.1.0 (2017-10-10)

- Added a method to expose the `toggleOpen` method from the widget. [pull request #8](https://github.com/blackbaud/help-client/pull/8)

# 1.0.2 (2017-09-06)

- Added more methods for handling the helpKey between the client and the help widget
- Added more tests for methods and style changes
- Renamed the BBHelp to BBHelpClient for clarity and distinction between the client and the widget.
- [pull request #6](https://github.com/blackbaud/help-client/pull/6)

# 1.0.1 (2017-05-10)

- Fixed dependency reference for `remap-istanbul`.

# 1.0.0 (2017-05-02)

- Initial release
