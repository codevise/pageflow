module Pageflow
  module EmbedCodeHelper
    def embed_code_entry_snippet(entry)
      Pageflow::EmbedCodeHelper::EntrySnippet.new(pageflow, entry)
    end

    class EntrySnippet
      def initialize(routes, entry)
        @routes = routes
        @entry = entry
      end

      def call
        %(<iframe src="#{url(entry)}" allowfullscreen></iframe>)
      end

      private

      attr_reader :routes, :entry

      def url(entry)
        routes.entry_embed_url(entry, entry_embed_url_options(entry))
      end

      def entry_embed_url_options(entry)
        options = Pageflow.config.entry_embed_url_options
        options = options.call(entry.site) if options.respond_to?(:call)
        options
      end
    end
  end
end
