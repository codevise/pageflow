module Pageflow
  module InfoBoxHelper
    def info_box(configuration)
      if configuration['additional_title'].blank? && configuration['additional_description'].blank?
        css_class = 'add_info_box empty'
      else
        css_class = 'add_info_box'
      end

      render('pageflow/pages/info_box', :configuration => configuration, :css_class => css_class)
    end

    def info_box_title(title)
      if title.present?
        content_tag(:h3, title)
      end
    end
  end
end
