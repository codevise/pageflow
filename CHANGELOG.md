# CHANGELOG

### Version 13.1.0

2019-01-22

[Compare changes](https://github.com/codevise/pageflow/compare/13-0-stable...v13.1.0)

##### Manual update steps: 
- Scope phone horizontal swipe with feature flag
  ([#1105](https://github.com/codevise/pageflow/pull/1105))
  
  The horizontal swipe navigation on phone is now guarded by a feature
  flag. If you there are entries using this functionality, make sure to
  add the following line to your Pageflow initializer:
  
      config.features.enable_by_default('phone_horizontal_slideshow_mode')


- Install new migrations in host application

##### Further Changes  
- Set locale to editors locale for new entries
  ([#1100](https://github.com/codevise/pageflow/pull/1100))
- Scope title loading spinner with feature flag
  ([#1104](https://github.com/codevise/pageflow/pull/1104))
- Trigger resize hooks on cookie notice dismiss
  ([#1101](https://github.com/codevise/pageflow/pull/1101))
- Improve lazy loading thumbnails
  ([#1099](https://github.com/codevise/pageflow/pull/1099))
- Ensure hls videos are used in Safari
  ([#1096](https://github.com/codevise/pageflow/pull/1096))
- Prevent loading of invisible images before load event
  ([#1094](https://github.com/codevise/pageflow/pull/1094))
- Loading spinner widget with title and blurred image
  ([#1090](https://github.com/codevise/pageflow/pull/1090))
- Improve handling of externally controlled player
  ([#1080](https://github.com/codevise/pageflow/pull/1080))
- Extract DelayedStart from pageflow.manualStart
  ([#1077](https://github.com/codevise/pageflow/pull/1077))
- Extract %background_logo SCSS placeholder
  ([#1062](https://github.com/codevise/pageflow/pull/1062))
- Add selector to get entry title
  ([#1061](https://github.com/codevise/pageflow/pull/1061))
- Add pageBackgroundImageUrl selector
  ([#1060](https://github.com/codevise/pageflow/pull/1060))
- Store order of collections in Redux store
  ([#1059](https://github.com/codevise/pageflow/pull/1059))
- Turn loading spinner into server rendered widget type
  ([#1051](https://github.com/codevise/pageflow/pull/1051))

See
[13-0-stable branch](https://github.com/codevise/pageflow/blob/13-0-stable/CHANGELOG.md)
for previous changes.
