# CHANGELOG

### Unreleased Changes

[Compare changes](https://github.com/codevise/pageflow/compare/12-1-stable...master)

**Manual Update Steps**

* Add the name of the S3 region you are using to `config/initializers/pageflow.rb`. You
will have to update this file manually. A fresh install of Pageflow will have
the s3 region included in the generated file.

The complete configuration looks like this:

``` ruby
config.paperclip_s3_default_options.merge!(
  s3_credentials: {
    bucket: ENV.fetch('S3_BUCKET', 'com-example-pageflow-development'),
    access_key_id: ENV.fetch('S3_ACCESS_KEY', 'xxx'),
    secret_access_key: ENV.fetch('S3_SECRET_KEY', 'xxx'),
  },
  s3_host_name: ENV.fetch('S3_HOST_NAME', 's3-eu-west-1.amazonaws.com'),
  s3_host_alias: ENV.fetch('S3_HOST_ALIAS', 'com-example-pageflow.s3-website-eu-west-1.amazonaws.com'),
  s3_protocol: ENV.fetch('S3_PROTOCOL', 'http'),
  s3_region: ENV.fetch('S3_REGION', 'eu-central-1')
)
```

**Internals**

* Upgraded `paperclip` to 5.0.0 and migrated to `aws-sdk-s3`. (#922)

See
[12-1-stable branch](https://github.com/codevise/pageflow/blob/12-1-stable/CHANGELOG.md)
for previous changes.
