Pageflow.configure do |config|
  config.paperclip_s3_default_options.merge!({
    storage: :filesystem,
    path: ':rails_root/tmp/attachments/test/s3/:class/:attachment/:id_partition/:style/:filename'
  })
end
