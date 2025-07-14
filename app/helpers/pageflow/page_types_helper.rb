module Pageflow
  module PageTypesHelper
    include RenderJsonHelper

    def page_type_json_seeds(config)
      render_json_partial('pageflow/page_types/page_type',
                          collection: config.page_types.to_a,
                          as: :page_type)
    end

    def page_type_json_seed(json, page_type)
      return unless page_type.json_seed_template

      json.partial!(template: page_type.json_seed_template, locals: {page_type:})
    end

    def page_type_templates(entry)
      # Required by RevisionFileHelper#find_file_in_entry
      @entry = entry

      safe_join(Pageflow.config.page_types.map do |page_type|
        content_tag(:script,
                    render(template: page_type.template_path,
                           locals: {
                             configuration: {},
                             page: Page.new,
                             entry:
                           },
                           layout: false).to_str,
                    type: 'text/html', data: {template: "#{page_type.name}_page"})
      end)
    end
  end
end
