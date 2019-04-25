Pageflow.configure do |config|
  config.paperclip_s3_root = 'test-host'

  config.paperclip_s3_default_options.merge!(
    storage: :filesystem,
    url: '/system/s3/:class/:attachment/:id_partition/:style/:filename',
    path: ':rails_root/public:url'
  )

  config.paperclip_direct_upload_options = lambda do |_|
    {
      url: '#',
      fields: []
    }
  end
end

# Reconstruct current config to ensure config block above is used
Pageflow.configure!
