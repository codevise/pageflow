module Pageflow
  module InfoBoxHelper
    def info_box(configuration)
      css_classes = ['add_info_box']

      if configuration['additional_title'].blank? &&
         configuration['additional_description'].blank?

        css_classes << 'empty'
      end

      if configuration['additional_title'].blank?
        css_classes << 'title_empty'
      end

      if configuration['additional_description'].blank?
        css_classes << 'description_empty'
      end

      render('pageflow/pages/info_box',
             configuration: configuration,
             css_class: css_classes * ' ')
    end

    def info_box_title(title)
      if title.present?
        content_tag(:h3, title)
      end
    end
  end
end
