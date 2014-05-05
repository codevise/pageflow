require 'socket'

Pageflow.configure do |config|
  config.paperclip_attachments_version = 'v1'
  config.paperclip_filesystem_root = Rails.root.join(':rails_roottmp/attachments/production/')

  if Rails.env.test?
    config.paperclip_s3_default_options = {
      :storage => :filesystem,
      :path => ':rails_root/tmp/attachments/test/s3/:class/:attachment/:id_partition/:style/:filename'
    }
  else
    config.paperclip_s3_default_options = {
      :storage => :s3,
      :s3_headers => {'Expires' => 1.year.from_now.httpdate},
      :s3_options => {:max_retries => 10},

      :url => ':s3_alias_url',
      :path => ':host/:class_basename/:attachment/:id_partition/:pageflow_attachments_version:style/:filename',

      # Paperclip deletes and reuploads the original on
      # reprocess. Sometimes S3 seems to change the order of commands
      # causing the image to be deleted. This is fixed on paperclip
      # master, but for us not deleting old files is good enough. They
      # might be in the CDN anyway.
      :keep_old_files => true
    }
  end

  config.paperclip_filesystem_default_options = {
    :storage => :filesystem,
    :path => ':pageflow_filesystem_root/:class/:attachment/:id_partition/:style/:filename',
    :url => 'not_uploaded_yet'
  }
end

if Rails.env.development?
  Paperclip.interpolates(:pageflow_filesystem_root) do |attachment, style|
    Rails.root.join('tmp/attachments/development/filesystem')
  end

  Paperclip.interpolates(:host) do |attachment, style|
    Socket.gethostname
  end
end

if Rails.env.production?
  Paperclip.interpolates(:pageflow_filesystem_root) do |attachment, style|
    Pageflow.config.paperclip_filesystem_root
  end

  Paperclip.interpolates(:host) do |attachment, style|
    'main'
  end
end

if Rails.env.test?
  Paperclip.interpolates(:pageflow_filesystem_root) do |attachment, style|
    Rails.root.join('tmp/attachments/test/filesystem')
  end

  Paperclip.interpolates(:host) do |attachment, style|
    'test-host'
  end

  class Paperclip::Attachment
    def bucket_name
      'test'
    end
  end
end

Paperclip.interpolates(:class_basename) do |attachment, style|
  plural_cache.underscore_and_pluralize(attachment.instance.class.name.split('::').last)
end

Paperclip.interpolates(:pageflow_placeholder) do |attachment, style|
  ActionController::Base.helpers.asset_path("pageflow/placeholder_#{style}.jpg")
end

Paperclip.interpolates(:pageflow_attachments_version) do |attachment, style|
  version = Pageflow.config.paperclip_attachments_version

  if version.present? && style != :original
    "#{version}/"
  end
end
