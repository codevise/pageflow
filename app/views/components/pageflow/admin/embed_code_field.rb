module Pageflow
  module Admin
    # @api private
    class EmbedCodeField < Pageflow::ViewComponent
      builder_method :embed_code_field

      def build(snippet, options = {})
        super(class: 'embed_code')
        text_node(text_field_tag(options.fetch(:name),
                                 snippet.call,
                                 onclick: '$(this).select()'))
        para(options[:hint])
      end
    end
  end
end
