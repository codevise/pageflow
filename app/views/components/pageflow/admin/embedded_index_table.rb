module Pageflow
  module Admin
    class EmbeddedIndexTable < ViewComponent
      builder_method :embedded_index_table

      attr_reader :base_collection, :scopes

      def build(base_collection, options = {})
        @base_collection = base_collection
        @scopes = []
        @blank_slate_text = options[:blank_slate_text]
        super()
      end

      def scope(*args)
        scopes << ActiveAdmin::Scope.new(*args)
      end

      def table_for_collection(*args, &block)
        if scopes.any?
          custom_scopes_renderer(scopes, :default_scope => scopes.first.id)
        end

        if scoped_collection.any?
          build_table(*args, &block)
        else
          build_blank_slate
        end
      end

      private

      def build_table(*args, &block)
        paginated_collection(scoped_collection.page(params[:page]).per(10),
                             :download_links => false) do
          table_for(collection, *args, &block)
        end
      end

      def build_blank_slate
        div :class => "blank_slate_container" do
          span :class => "blank_slate" do
            @blank_slate_text
          end
        end
      end

      def scoped_collection
        current_scope ? base_collection.send(current_scope.id) : base_collection
      end

      def current_scope
        scopes.find do |scope|
          scope.id.to_s == params[:scope]
        end || scopes.first
      end
    end
  end
end
