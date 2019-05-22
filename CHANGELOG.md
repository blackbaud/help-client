# 2.0.0-beta.6 (2019-05-22)

- Created `amd` bundle to support RE and FE use cases. [#42](https://github.com/blackbaud/help-client/pull/42)

# 2.0.0-beta.5 (2019-05-1)

- Official beta release of Help Client v2.
  - Reformatted to support CDN and NPM.
  - Removed Travis publish and package steps.
  - Adopted Azure npm-package-oss pipeline type in Azure.
  - Reworked to use new [BB Help SPA](https://host.nxt.blackbaud.com/bb-help/).
  - Created communication service to pass information between SPA and Help Client.

# 1.3.0 (2018-04-23)

- Added optional param to `openWidget` method to pass `helpKey` to widget. [#13](https://github.com/blackbaud/help-client/pull/13)

# 1.2.0 (2018-04-19)

- Added Ready, Open, Close, Disable, and Enable methods for widget. [#11](https://github.com/blackbaud/help-client/pull/11)

# 1.1.0 (2017-10-10)

- Added method to expose `toggleOpen` method from widget. [#8](https://github.com/blackbaud/help-client/pull/8)

# 1.0.2 (2017-09-06)

- Added more methods to handle `helpKey` between client and help widget.
- Added tests for methods and style changes.
- Renamed `BBHelp` to `BBHelpClient` for clarity and distinction between client and widget.
- [#6](https://github.com/blackbaud/help-client/pull/6)

# 1.0.1 (2017-05-10)

- Fixed dependency reference for `remap-istanbul`.

# 1.0.0 (2017-05-02)

- Initial release.
