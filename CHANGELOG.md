# CHANGELOG

### Changes on `master`

[Compare changes](https://github.com/codevise/pageflow/compare/12-0-stable...master)

#### Breaking Changes

- The built-in widget types must now be registered in the host application. To keep existing functionality from previous Pageflow versions, add this line to `config/initializers/pageflow.rb` in your host application:

```
config.plugin(Pageflow.built_in_widget_types_plugin)
```

Media stack:

- Switch from `Expires` to `Cache-Control` header for media uploads.
  ([#753](https://github.com/codevise/pageflow/pull/753))

It’s recommended you update the files currently stored on S3:

```
s3cmd --recursive modify --add-header="Cache-Control: public, max-age=31536000" s3://yourbucket/
s3cmd --recursive modify --remove-header=Expires s3://yourbucket/
```

Tread carefully when you do this! As noted in [this StackExchange answer](http://stackoverflow.com/questions/22501465/how-to-add-cache-control-in-aws-s3), we have experienced that some public read permissions were lost after running this script. Test first using just a single object. In the AWS Management Console, you might want to grant public read access on the entire bucket again to be safe.

See
[12-0-stable](https://github.com/codevise/pageflow/blob/12-0-stable/CHANGELOG.md)
branch for previous changes.
