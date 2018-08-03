require 'socket'
require 'pageflow/paperclip_interpolations/support'

Pageflow.configure do |config|
  config.paperclip_attachments_version = 'v1'
  config.paperclip_filesystem_root = Rails.root.join('tmp/attachments/production/')

  if Rails.env.test?
    config.paperclip_s3_default_options.merge!({
      storage: :filesystem,
      path: ':rails_root/tmp/attachments/test/s3/:class/:attachment/:id_partition/:style/:filename'
    })
  else
    config.paperclip_s3_default_options.merge!({
      storage: :s3,
      s3_headers: {'Cache-Control' => "public, max-age=31536000"},
      s3_options: {max_retries: 10},

      url: ':s3_alias_url',
      path: ':host/:class_basename/:attachment/:id_partition/:pageflow_attachments_version:style/:filename',

      # Paperclip deletes and reuploads the original on
      # reprocess. Sometimes S3 seems to change the order of commands
      # causing the image to be deleted. This is fixed on paperclip
      # master, but for us not deleting old files is good enough. They
      # might be in the CDN anyway.
      keep_old_files: true
    })
  end

  config.paperclip_filesystem_default_options.merge!({
    storage: :filesystem,
    path: ':pageflow_filesystem_root/:class/:attachment/:id_partition/:style/:filename',
    url: 'not_uploaded_yet'
  })

  config.thumbnail_styles = {
    thumbnail: {
      geometry: '100x100#',
      format: :JPG
    },
    thumbnail_large: {
      geometry: '560x315#',
      format: :JPG
    },

    navigation_thumbnail_small: {
      geometry: '85x47#',
      format: :JPG
    },
    navigation_thumbnail_large: {
      geometry: '170x95#',
      format: :JPG
    },
    thumbnail_overview_desktop: {
      geometry: '230x72#',
      format: :JPG
    },
    thumbnail_overview_mobile: {
      geometry: '200x112#',
      format: :JPG
    },

    link_thumbnail: {
      geometry: '192x108#',
      format: :JPG
    },
    link_thumbnail_large: {
      geometry: '394x226#',
      format: :JPG
    }
  }
end

if Rails.env.development?
  Paperclip.interpolates(:pageflow_filesystem_root) do |attachment, style|
    Rails.root.join('tmp/attachments/development/filesystem')
  end

  Paperclip.interpolates(:host) do |attachment, style|
    ENV.fetch('PAGEFLOW_ATTACHMENTS_SCOPE_NAME') { Socket.gethostname }
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
  Pageflow::PaperclipInterpolations::Support.class_basename(attachment, style)
end

Paperclip.interpolates(:pageflow_placeholder) do |attachment, style|
  Pageflow::PaperclipInterpolations::Support.pageflow_placeholder(attachment, style)
end

Paperclip.interpolates(:pageflow_attachments_version) do |attachment, style|
  Pageflow::PaperclipInterpolations::Support.pageflow_attachments_version(attachment, style)
end

Paperclip.configure do |config|
  config.register_processor(:pageflow_vtt, Pageflow::PaperclipProcessors::Vtt)
end

Paperclip::UriAdapter.register
