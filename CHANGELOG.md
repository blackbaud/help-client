# 2.0.0-beta.10 (2019-06-11)

- Moved the help widget ready check logic in to the help widget load implementation to ensure that the inner iFrame has loaded before communication messages are sent to the iFrame. [#51](https://github.com/blackbaud/help-client/pull/51)

# 2.0.0-beta.9 (2019-06-04)

- Added JSON serialization to the config object to remove functions that could break the iFrame communications. [#49](https://github.com/blackbaud/help-client/pull/49)

# 2.0.0-beta.8 (2019-05-30)

- Fixed a bug where the target `window` bundle was not attaching to the window. [#47](https://github.com/blackbaud/help-client/pull/47)

# 2.0.0-beta.7 (2019-05-30)

- Created the `window` bundle to support RE and FE use cases. [#45](https://github.com/blackbaud/help-client/pull/45)

# 2.0.0-beta.6 (2019-05-22)

- Created the `amd` bundle to support RE and FE use cases. [#42](https://github.com/blackbaud/help-client/pull/42)

# 2.0.0-beta.5 (2019-05-1)

- Official beta release of Help Client v2.
  - Reformatted to support CDN and NPM.
  - Removed the Travis publish and package steps.
  - Adopted the Azure npm-package-oss pipeline type in Azure.
  - Reworked to use the new [BB Help SPA](https://host.nxt.blackbaud.com/bb-help/).
  - Created a communication service to pass information between the SPA and the Help Client.

# 1.3.0 (2018-04-23)

- Added an optional param to the `openWidget` method to pass `helpKey` to the widget. [#13](https://github.com/blackbaud/help-client/pull/13)

# 1.2.0 (2018-04-19)

- Added the Ready, Open, Close, Disable, and Enable methods for the widget. [#11](https://github.com/blackbaud/help-client/pull/11)

# 1.1.0 (2017-10-10)

- Added a method to expose the `toggleOpen` method from the widget. [#8](https://github.com/blackbaud/help-client/pull/8)

# 1.0.2 (2017-09-06)

- Added more methods to handle `helpKey` between the client and the help widget.
- Added tests for methods and style changes.
- Renamed `BBHelp` to `BBHelpClient` for clarity and distinction between the client and the widget.
- [#6](https://github.com/blackbaud/help-client/pull/6)

# 1.0.1 (2017-05-10)

- Fixed a dependency reference for `remap-istanbul`.

# 1.0.0 (2017-05-02)

- Initial release.
