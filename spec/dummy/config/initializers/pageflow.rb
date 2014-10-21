ActiveAdmin.application.load_paths.unshift(Dir[Pageflow::Engine.root.join('admins')])

Pageflow.configure do |config|
  config.register_page_type(Pageflow::BuiltInPageType.background_image)
  config.register_page_type(Pageflow::BuiltInPageType.background_video)
  config.register_page_type(Pageflow::BuiltInPageType.video)
  config.register_page_type(Pageflow::BuiltInPageType.audio)
  config.register_page_type(Pageflow::BuiltInPageType.internal_links)

  config.themes.register(:default)

  config.paperclip_attachments_version = 'v1'
  config.paperclip_filesystem_root = 'tmp/attachments/production'

  config.paperclip_s3_default_options.merge!(
    :s3_credentials => {
      :bucket => 'com-example-pageflow-development',
      :access_key_id => 'xxx',
      :secret_access_key => 'xxx',
      :s3_host_name => 's3-eu-west-1.amazonaws.com'
    },
    :s3_host_alias => 'com-example-pageflow.s3-website-eu-west-1.amazonaws.com',
    :s3_protocol => 'http'
  )

  config.zencoder_options.merge!(
    :api_key => 'integration test key',
    :output_bucket => 'com-example-pageflow-out',
    :s3_host_alias => 'com-example-pageflow-out.s3-website-eu-west-1.amazonaws.com',
    :s3_protocol => 'http',
    :attachments_version => 'v1'
  )
end

Pageflow.finalize!
