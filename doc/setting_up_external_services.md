# Setting up External Services

Pageflow uses some external services to process and store media files:

  * [Amazon S3](http://aws.amazon.com/s3/) to host its videos, images
    and audios.
  * [Zencoder](https://zencoder.com/) to encode the content to fit the
    different formats needed.
  * (In production environment) A
    [CDN](http://en.wikipedia.org/wiki/Content_delivery_network) to
    speed up access to the content
    (e.g. [Amazon Cloudfront](http://aws.amazon.com/cloudfront/)).

Please create accounts for [Amazon AWS](http://aws.amazon.com/) and
[Zencoder](https://zencoder.com/).

Files that are uploaded to be used in Pageflow will be stored in an S3
bucket. Zencoder takes them from there, encodes the files and stores
them in a second bucket. The website displays the content from this
second bucket via the CDN.

## Amazon S3

Two Amazon S3 buckets are needed are needed for each environment.

  * Main bucket for paperclip attachments and Zencoder to read from.
  * Output bucket for Zencoder to write encoded files to.

For example:

  * `de-mycompany-pageflow-production`
  * `de-mycompany-pageflow-production-out`
  * `de-mycompany-pageflow-development`
  * `de-mycompany-pageflow-development-out`

You can add buckets for `staging` or other deployment environments.
Multiple developers can share the same development buckets because
files in this buckets are namespaced by the hostname of the
developer's machine.

Hint: Its better to use dashes `-` than dots `.`. Dots can cause
trouble when using https.

### Bucket Configuration

* Configure static website hosting for each bucket.

  * Go to Properties -> Static Website Hosting
  * Click "Enable Static Website Hosting".
  * Enter arbitrary string into the field "Index Document"
    (i.e. "foo", you can't save without this)
  * Click "Save"

* Grant access to the buckets by adding
  [bucket policies](./setting_up_s3_bucket_policies.md).

  * Our policies also enable public read access to your bucket. This
    is required.
  * Go to Properties -> Permissions.
  * Click "Bucket Policy".
  * Copy the correct JSON snippet from
    [bucket policies](./setting_up_s3_bucket_policies.md) (main or
    output)
  * Replace the \<main bucket\> or \<output bucket\> placeholders with
    the full bucket name.
  * Click "Save"

* You need to enable Cross Origin Resource Sharing (CORS).

  * Still in the Permissions screen, click _CORS Configuration_.
  * Paste the code below. The first rule grants everyone GET requests, which is
    what Pageflow needs. The second rule grants POST access to your origin. 
    This is required for file uploads to work.

```
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <MaxAgeSeconds>28800</MaxAgeSeconds>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
    <CORSRule>
        <AllowedOrigin>{insert your origin here}</AllowedOrigin>
        <AllowedMethod>POST</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

You will need to make sure that your production bucket has an appropriate origin set for _AllowedOrigin_.
You can tweak these rules if you want to. See the
[Amazon Developer Guide](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html#how-do-i-enable-cors).

### Bandwidth Detection

Pageflow measures the download times of some static files to detect
the bandwidth of the client.

The following files have to be placed in the Output ("-out") bucket:

  * [app/assets/images/pageflow/bandwidth_probe_large.png](https://raw.githubusercontent.com/codevise/pageflow/master/app/assets/images/pageflow/bandwidth_probe_large.png)
  * [app/assets/images/pageflow/bandwidth_probe_small.png](https://raw.githubusercontent.com/codevise/pageflow/master/app/assets/images/pageflow/bandwidth_probe_small.png).

### Configuring Paperclip

Pageflow uses the
[Paperclip](https://github.com/thoughtbot/paperclip/) gem, to upload
files to S3. Edit the `paperclip_s3_default_options` settings in
`config/initializers/pageflow.rb`:

```ruby
  config.paperclip_s3_default_options.merge!(
    s3_credentials: {
      bucket: 'com-example-pageflow-development',
      access_key_id: 'xxx',
      secret_access_key: 'xxx'
    },
    s3_host_name: 's3-eu-west-1.amazonaws.com',
    s3_region: 'eu-west-1',
    s3_host_alias: 'com-example-pageflow.s3-website-eu-west-1.amazonaws.com',
    s3_protocol: 'http'
  )
```

The required options are:

* `bucket`: The name of the main S3 bucket you chose above.

* `access_key_id`/`secret_access_key`:
  [IAM](http://aws.amazon.com/de/iam/) credentials that grant write
  access to your main bucket.

* `s3_host_name`: The host name that shall be used on the server side
  to connect to the S3 REST API to upload files. The correct value
  depends on the region of your bucket. See the list of
  [S3 AWS endpoints](http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region)
  for more information.  **Important**: Be sure NOT to enter an S3
  Website endpoint (`s3-website-*.amazonaws.com`) here. Those enpoints
  can only be used for read access to files from your buckets.

* `s3_region`: The AWS region where you've created your buckets.

* `s3_host_alias`: The host name that shall be used for image URLs in
  your published entries. This can be the hostname of some CDN you
  have configured to deliver files from your bucket. Even though use
  of a CDN is strongly recommended, you can also use an S3 Website
  endpoint here, as in the example above.

* `s3_protocol`: The protocol to use for public image URLs. Note that
  S3 Website endpoints only support `http`.

Refer to the
[Paperclip documentation](http://www.rubydoc.info/gems/paperclip/Paperclip/Storage/S3)
for a full list of supported options.

## Zencoder

Get your API Key from [Zencoder](https://zencoder.com) and make sure
it is used in the `zencoder_options` in
`config/initializers/pageflow.rb`:

```ruby
  config.zencoder_options.merge!(
    api_key: 'xxx',
    output_bucket: 'com-example-pageflow-out',
    s3_host_alias: 'com-example-pageflow-out.s3-website-eu-west-1.amazonaws.com',
    s3_protocol: 'http',
    attachments_version: 'v1'
  )
```

Just like in the previous section, the `s3_host_alias` and
`s3_protocol` settings are used to build video and audio URLs inside
your published entries.

Note that Zencoder offers a special "Integration API Key" that can be
used free of charge during development. Encoded files are cropped at
five seconds.

## Amazon Cloudfront

Create three distributions:

- one for each of the two S3 buckets
- one for which has the rails app itself as origin

Configure CNAMES and make sure they are used in
`config/initializers/pageflow.rb` as `s3_host_alias` in production
mode.  Please see the inline docs and examples in
`config/initializers/pageflow.rb`.
