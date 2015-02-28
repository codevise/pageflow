module Pageflow
  module PageTypesHelper
    include RenderJsonHelper

    def page_type_json_seeds(config)
      render_json_partial('pageflow/page_types/page_type',
                          collection: config.page_types,
                          as: :page_type)
    end

    def page_type_templates
      safe_join(Pageflow.config.page_types.map do |page_type|
        content_tag(:script,
                    render_to_string(:template => page_type.template_path,
                                     :locals => {:configuration => {}, :page => Page.new},
                                     :layout => false).to_str,
                    :type => 'text/html', :data => {:template => "#{page_type.name}_page"})
      end)
    end
  end
end
