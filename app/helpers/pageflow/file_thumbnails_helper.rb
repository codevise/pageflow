module Pageflow
  module FileThumbnailsHelper
    def file_thumbnails_css(revision)
      render(partial: 'pageflow/file_types/thumbnails',
             collection: Pageflow.config.file_types.with_thumbnail_support,
             as: :file_type,
             locals: {
               revision:,
               styles: Pageflow.config.css_rendered_thumbnail_styles
             })
    end

    def file_thumbnail_css_class(file, style)
      return if file.blank?

      [file.to_model.class.model_name.singular, style, file.perma_id].join('_')
    end
  end
end
