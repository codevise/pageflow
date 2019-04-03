# CHANGELOG

### Version 14.0.0.beta2

2019-04-03

[Compare changes](https://github.com/codevise/pageflow/compare/v14.0.0.beta1...v14.0.0.beta2)

- Structured data for videos, audios and background images
  ([#1145](https://github.com/codevise/pageflow/pull/1145))
- Change header structure to improve document outline
  ([#1139](https://github.com/codevise/pageflow/pull/1139))
- Allow passing custom query params for collection.create
  ([#1136](https://github.com/codevise/pageflow/pull/1136))
- Bug fix: Setup visited pages before resolving ready
  ([#1144](https://github.com/codevise/pageflow/pull/1144))
- Update chromedriver-helper to fix travis build
  ([#1140](https://github.com/codevise/pageflow/pull/1140))

### Version 14.0.0.beta1

2019-03-08

[Compare changes](https://github.com/codevise/pageflow/compare/13-x-stable...v14.0.0.beta1)

#### Manual Update Steps

- Direct upload to S3
  ([#1076](https://github.com/codevise/pageflow/pull/1076))

  Files are now uploaded directly to S3 from the browser. The
  following steps need to be performed:

  * Update CORS-config for S3 bucket as described in
    [`doc/setting_up_external_services.md`](https://github.com/codevise/pageflow/blob/14-0-stable/doc/setting_up_external_services.md).

  * `nginx-upload-module` is no longer supported since the requests to
    create files no longer contain uploads. Corresponding Nginx
    configuration for Pageflow endpoints needs to be removed. Check
    whether the `paperclip-nginx-upload` io adapter is still needed.

#### Breaking Changes for Pageflow Plugins

- Page DOM layout change
  ([#1135](https://github.com/codevise/pageflow/pull/1135))

  Page headers are now have level 3 instead of level 2. There is a new
  helper which is recommended to render the default page header and
  content text.

  ERB template based page types need to make the following changes to
  CSS class names in their page templates:

  * `blackLayer` -> `black_layer`
  * `backgroundArea` -> `page_background`
  * `contentWrapper` -> `content_wrapper`
  * `videoWrapper` -> `uncropped_media_wrapper`

  The default header and content snippet

        <div class="page_header">
          <h2>
            <span class="tagline"><%= configuration['tagline'] %></span>
            <span class="title"><%= configuration['title'] %></span>
            <span class="subtitle"><%= configuration['subtitle'] %></span>
          </h2>
          <%= background_image_tag(configuration['background_image_id'], {class: "print_image"}) %>
        </div>
        <div class="contentText">
          <p><%= raw configuration['text'] %></p>
        </div>

  should be replaced with the following helper call:

        <%= page_default_content(page) %>

- Direct upload to S3
  ([#1132](https://github.com/codevise/pageflow/pull/1132))

  Files are now uploaded directly to S3 from the browser. The state
  machine defined by `HostedFile` therefore no longer includes states
  like `uploading_to_s3`. Files which are be in state
  `uploading_to_s3_failed` have to be migrated to the
  `uploading_failed` state. See the migrations inside the PR for
  examples.

#### Minor Changes

- Add shared specs to pageflow-support to lint page types
  ([#1133](https://github.com/codevise/pageflow/pull/1133))
- Increase max length for page tagline, title and subtitles
  ([#1131](https://github.com/codevise/pageflow/pull/1131))
- Include text in navigation bar links
  ([#1129](https://github.com/codevise/pageflow/pull/1129))

See
[13-x-stable branch](https://github.com/codevise/pageflow/blob/13-x-stable/CHANGELOG.md)
for previous changes.
