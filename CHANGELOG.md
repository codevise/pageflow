# CHANGELOG

### Version 12.2.0

2018-07-27

[Compare changes](https://github.com/codevise/pageflow/compare/12-1-stable...v12.2.0)

##### Pubic Site

- Mute background videos to fix autoplay on Safari 11
  ([#960](https://github.com/codevise/pageflow/pull/960))
- Add support for locales with right to left script
  ([#954](https://github.com/codevise/pageflow/pull/954))
- Improve content links to pages of entry
  ([#953](https://github.com/codevise/pageflow/pull/953))
- Fallback to page title in overview page description
  ([#951](https://github.com/codevise/pageflow/pull/951))
- Bug fix: Fix page transition effects in Chrome 66 and above
  ([#971](https://github.com/codevise/pageflow/pull/971))
- Bug fix: Improve tracking of visited pages
  ([#965](https://github.com/codevise/pageflow/pull/965))
- Bug fix: Fix "hide text" swipe gesture for react page types
  ([#919](https://github.com/codevise/pageflow/pull/919))

##### Admin

- Bug fix: Extend user management permissions in single account mode
  ([#934](https://github.com/codevise/pageflow/pull/934))
- Bug fix: Fix filtering in searchable theming select in entry form
  ([#947](https://github.com/codevise/pageflow/pull/947))

##### Themes

- New variable to determine size of glowing area
  ([#921](https://github.com/codevise/pageflow/pull/921))
- Move page padding from legacy styles to theme
  ([#935](https://github.com/codevise/pageflow/pull/935))
- Extract shadow and scroller styles from page theme
  ([#972](https://github.com/codevise/pageflow/pull/972))
- Variable for color of title on inverted pages
  ([#969](https://github.com/codevise/pageflow/pull/969))
- Typo variables for multimedia alert
  ([#966](https://github.com/codevise/pageflow/pull/966))
- Allow setting phone height on background image logo variant
  ([#964](https://github.com/codevise/pageflow/pull/964))
- Fixed wrong variable for page-header-title
  ([#962](https://github.com/codevise/pageflow/pull/962))
- Image variants for logo & loading spinner
  ([#961](https://github.com/codevise/pageflow/pull/961))
- Logo banner & logo svg option
  ([#958](https://github.com/codevise/pageflow/pull/958))
- Add logical layout mixins for borders and paddings
  ([#956](https://github.com/codevise/pageflow/pull/956))
- Variable for watermark logo opacity
  ([#946](https://github.com/codevise/pageflow/pull/946))

##### Rails Engine

- Allow registering admin attributes table rows
  ([#928](https://github.com/codevise/pageflow/pull/928))
- Add page split layout utility methods
  ([#920](https://github.com/codevise/pageflow/pull/920))
- Add dominos to pageflow-support to test admin features
  ([#931](https://github.com/codevise/pageflow/pull/931))
- Add color picker input view
  ([#788](https://github.com/codevise/pageflow/pull/788))
- Add defaultValueBinding option to color input view
  ([#959](https://github.com/codevise/pageflow/pull/959))
- Allow integrating with Krant app news
  ([#918](https://github.com/codevise/pageflow/pull/918))
- Developer console
  ([#925](https://github.com/codevise/pageflow/pull/925))
- Log rescued exceptions on debug level
  ([#900](https://github.com/codevise/pageflow/pull/900))

##### Documentation

- Update page type and widget type creation guides
  ([#917](https://github.com/codevise/pageflow/pull/917))
- Update `setting_up_s3_bucket_policies.md`
  ([#902](https://github.com/codevise/pageflow/pull/902))
- Improve readme/add code of conduct
  ([#936](https://github.com/codevise/pageflow/pull/936))
- Typos fixed
  ([#924](https://github.com/codevise/pageflow/pull/924))

##### Internal

- Replace phantomjs with headless chrome
  ([#952](https://github.com/codevise/pageflow/pull/952))
- Remove rubygems 2.7.0 dummy app generation fix
  ([#916](https://github.com/codevise/pageflow/pull/916))
- Use teaspoon fork from pageflow branch
  ([#927](https://github.com/codevise/pageflow/pull/927))
- Update rubocop
  ([#929](https://github.com/codevise/pageflow/pull/929))
- Fix jquery error in node_package specs on travis
  ([#948](https://github.com/codevise/pageflow/pull/948))
- Remove unused domino and matcher methods
  ([#945](https://github.com/codevise/pageflow/pull/945))
- Remove todo comments
  ([#937](https://github.com/codevise/pageflow/pull/937))

See
[12-1-stable branch](https://github.com/codevise/pageflow/blob/12-1-stable/CHANGELOG.md)
for previous changes.
