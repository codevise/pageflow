Pageflow.configure do |config|
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

# The dynamic :host ensures multiple developers can use a shared S3 bucket in development.
Paperclip.interpolates(:host) do |attachment, style|
  if Rails.env.development?
    Socket.gethostname
  else
    'main'
  end
end

Paperclip.interpolates(:pageflow_filesystem_root) do |attachment, style|
  Pageflow.config.paperclip_filesystem_root
end

Paperclip.interpolates(:class_basename) do |attachment, style|
  plural_cache.underscore_and_pluralize(attachment.instance.class.name.split('::').last)
end

Paperclip.interpolates(:pageflow_placeholder) do |attachment, style|
  "pageflow/placeholder_#{style}.jpg"
end

Paperclip.interpolates(:pageflow_attachments_version) do |attachment, style|
  version = Pageflow.config.paperclip_attachments_version

  if version.present? && style != :original
    "#{version}/"
  end
end

Paperclip.configure do |config|
  config.register_processor(:pageflow_vtt, Pageflow::PaperclipProcessors::Vtt)
end
