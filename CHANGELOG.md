# 3.0.1

- Add `helpMode` config property to enable a _menu_ mode that will do the following:
  - Will _not_ display any visual elements for the widget, including the iframe that embedded the bb-help SPA.
  - Will leverage stored configs directly from this project, as opposed to the configs in bb-help SPA (since it's no longer embedded).
  - Will open all topics in a new tab.
  - Will call an optional `helpUpdateCallback` when the current topic is changed.
- Deprecate properties that only apply to a `helpMode` of _legacy_; _menu_ is the preferred mode going forward.
- Add `unload` method.

# 3.0.0 (2020-06-09)

### Breaking changes

- Removed the analytics service and `mixpanel-browser` dependency. Analytics should be handled by the consuming application. [#70](https://github.com/blackbaud/help-client/pull/70)

# 3.0.0-rc.0 (2020-05-08)

### Breaking changes

- Removed the analytics service and `mixpanel-browser` dependency. Analytics should be handled by the consuming application. [#70](https://github.com/blackbaud/help-client/pull/70)

# 2.2.0 (2020-03-06)
- Fixed package dependency structure to list `mixpanel-browser` as a peer dependency. [#68](https://github.com/blackbaud/help-client/pull/68)

# 2.1.0 (2019-09-06)

- Added `open-widget` message handling. [#64](https://github.com/blackbaud/help-client/pull/64)

# 2.0.3 (2019-08-06)

- Fixed a bug that caused the invoker to be hidden on mobile height sizes. [#62](https://github.com/blackbaud/help-client/pull/62)

# 2.0.2 (2019-07-25)

- Delayed rendering elements until the `load` method has been called. [#59](https://github.com/blackbaud/help-client/pull/59)

# 2.0.1 (2019-07-24)

- Fixed package dependency structure to list `rxjs` as a peer dependency.

# 2.0.0 (2019-06-27)

- Official 2.0.0 release
  - Added `environmentId` as a config option. [#53](https://github.com/blackbaud/help-client/pull/53)
  - Updated `travis.yml` file to support the changes for `xvfb`

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
