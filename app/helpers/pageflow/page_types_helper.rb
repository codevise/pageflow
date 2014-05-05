module Pageflow
  module PageTypesHelper
    include RenderJsonHelper

    def page_type_json_seeds
      render_json_partial('pageflow/page_types/page_type', :collection => Pageflow.config.page_types, :as => :page_type)
    end

    def page_type_templates
      Pageflow.config.page_types.map do |page_type|
        content_tag(:script, :type => 'text/html', :data => {:template => "#{page_type.name}_page"}) do
          render_to_string(:template => page_type.template_path,
                           :locals => {:configuration => {}, :page => Page.new},
                           :layout => false)
        end
      end.join(' ').html_safe
    end
  end
end
