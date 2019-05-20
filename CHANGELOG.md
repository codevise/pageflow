# CHANGELOG

  
### Version 14.1.0

2019-05-20

[Compare changes](https://github.com/codevise/pageflow/compare/14-0-stable...v14.1.0)

#### Manual Update Steps
- Configurable sharing providers
  ([#1142](https://github.com/codevise/pageflow/pull/1142))
  
  You can now configure which sharing providers should be enabled for your stories.
  Default providers for new and existing stories can be set via the pageflow initializer:
  ```
  config.default_share_providers = [:facebook, :twitter, :email]
  ```

  To restrict the set of sharing providers you can also specify which ones should
  be available to editors:
  ``` 
  config.available_share_providers = [:email, :facebook, :linked_in, :twitter, :telegram, :whats_app]
  ```
  By default all available providers are enabled.
  
  For custom themes the share icons can be styled via newly introduced  SCSS-variables:
  
  ```
  $share-icon-color: #7D7D7D;
  $share-icon-hover-color: #909090;
  $share-icon-active-color: #FFC001;
  ```

- Remove paperclip_filesystem_root config
  ([#1150](https://github.com/codevise/pageflow/pull/1150))
  
  Since uploads go directly to S3 via direct upload (signed post request)
  the `paperclip_filesystem_root` configuration is now deprecated and can be removed
  from the pageflow initializer. 

#### Editor 
- Add lists to WYSIHTML editor
  ([#1156](https://github.com/codevise/pageflow/pull/1156))
- Add option to link to other pages from page text
  ([#1154](https://github.com/codevise/pageflow/pull/1154))
- Bug fix: Prevent page styles from applying to editor elements
  ([#1153](https://github.com/codevise/pageflow/pull/1153))
  
#### Published Entries
- Reset background color in fullscreen Safari
  ([#1159](https://github.com/codevise/pageflow/pull/1159))
  
#### Custom Themes
- Add theme variable for title color
  ([#1157](https://github.com/codevise/pageflow/pull/1157))
  
#### Internals
- Add build-edge script
  ([#1152](https://github.com/codevise/pageflow/pull/1152))
- Fix spec for jbuilder 2.9
  ([#1158](https://github.com/codevise/pageflow/pull/1158))
  
  
See
[14-0-stable branch](https://github.com/codevise/pageflow/blob/14-0-stable/CHANGELOG.md)
for previous changes.
