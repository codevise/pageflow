module Pageflow
  module InfoBoxHelper
    def info_box(configuration)
      css_classes = ['add_info_box']

      if configuration['additional_title'].blank? &&
         configuration['additional_description'].blank?

        css_classes << 'empty'
      end

      css_classes << 'title_empty' if configuration['additional_title'].blank?

      css_classes << 'description_empty' if configuration['additional_description'].blank?

      render('pageflow/pages/info_box',
             configuration:,
             css_class: css_classes * ' ')
    end

    def info_box_title(title)
      return unless title.present?

      content_tag(:h3, title)
    end
  end
end
