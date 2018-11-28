module Pageflow
  class Configuration
    module Defaults
      PAPERCLIP_S3_DEFAULT_OPTIONS = {
        storage: :s3,
        s3_headers: {'Cache-Control' => 'public, max-age=31536000'},

        url: ':s3_alias_url',
        path: ':pageflow_s3_root/:class_basename/:attachments_path_name/' \
              ':id_partition/:pageflow_attachments_version:style/:filename',

        validate_media_type: false,

        # Paperclip deletes and reuploads the original on
        # reprocess. Sometimes S3 seems to change the order of commands
        # causing the image to be deleted. This is fixed on paperclip
        # master, but for us not deleting old files is good enough. They
        # might be in the CDN anyway.
        keep_old_files: true
      }.freeze

      THUMBNAIL_STYLES = {
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
      }.freeze

      CSS_RENDERED_THUMBNAIL_STYLES = [
        :thumbnail_large,
        :navigation_thumbnail_large,
        :link_thumbnail,
        :link_thumbnail_large
      ].freeze
    end
  end
end
