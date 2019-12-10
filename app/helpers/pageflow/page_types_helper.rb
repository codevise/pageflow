module Pageflow
  module PageTypesHelper
    include RenderJsonHelper

    def page_type_json_seeds(config)
      render_json_partial('pageflow/page_types/page_type',
                          collection: config.page_types,
                          as: :page_type)
    end

    def page_type_json_seed(json, page_type)
      if page_type.json_seed_template
        json.partial!(template: page_type.json_seed_template, locals: {page_type: page_type})
      end
    end

    def page_type_templates(entry)
      safe_join(Pageflow.config.page_types.map do |page_type|
        content_tag(:script,
                    render_to_string(template: page_type.template_path,
                                     locals: {
                                       configuration: {},
                                       page: Page.new,
                                       entry: entry,

                                       # Required by RevisionFileHelper#find_file_in_entry
                                       :@entry => entry
                                     },
                                     layout: false).to_str,
                    type: 'text/html', data: {template: "#{page_type.name}_page"})
      end)
    end
  end
end
