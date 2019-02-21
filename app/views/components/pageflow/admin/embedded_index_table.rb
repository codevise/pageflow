module Pageflow
  module Admin
    class EmbeddedIndexTable < ViewComponent
      builder_method :embedded_index_table

      attr_reader :base_collection, :scopes

      def build(base_collection, options = {})
        @base_collection = base_collection
        @scopes = []
        @sort_columns = []
        @blank_slate_text = options[:blank_slate_text]
        @model = options[:model]
        super()
      end

      def scope(*args)
        options = args.extract_options!
        title = args[0]
        method = args[1]
        options[:localizer] ||= ActiveAdmin::Localizers::ResourceLocalizer.new(@model&.model_name)
        scopes << ActiveAdmin::Scope.new(title, method, options)
      end

      def table_for_collection(options = {}, &block)
        if scopes.any?
          custom_scopes_renderer(scopes, default_scope: scopes.first.id)
        end

        record_sort_columns(&block) if options[:sortable]

        if scoped_collection.any?
          build_table(options, &block)
        else
          build_blank_slate
        end
      end

      private

      def build_table(options, &block)
        paginated_collection(paginate(apply_sorting(scoped_collection)),
                             download_links: false) do
          table_for(collection, options, &block)
        end
      end

      def build_blank_slate
        div class: 'blank_slate_container' do
          span class: 'blank_slate' do
            @blank_slate_text
          end
        end
      end

      def scoped_collection
        current_scope ? base_collection.send(current_scope.scope_method) : base_collection
      end

      def current_scope
        scopes.detect do |scope|
          scope.id.to_s == params[:scope]
        end || scopes.first
      end

      def paginate(collection)
        collection.page(params[:page]).per(10)
      end

      def apply_sorting(collection)
        if has_sort_columns?
          collection.reorder(order_clause)
        else
          collection
        end
      end

      def has_sort_columns?
        @sort_columns.any?
      end

      def order_clause
        if valid_order?
          params[:order].gsub('_asc', ' ASC').gsub('_desc', ' DESC')
        else
          "#{@sort_columns.first} ASC"
        end
      end

      def valid_order?
        params[:order] &&
          @sort_columns.include?(params[:order].gsub('_asc', '').gsub('_desc', ''))
      end

      def record_sort_columns(&block)
        recorder = SortColumnRecorder.new
        recorder.instance_eval(&block)
        @sort_columns = recorder.columns
      end

      class SortColumnRecorder
        attr_reader :columns

        def initialize
          @columns = []
        end

        def column(name = nil, options = {})
          if options[:sortable].is_a?(String) || options[:sortable].is_a?(Symbol)
            @columns << options[:sortable].to_s
          elsif options[:sortable] != false && name
            @columns << name.to_s
          end
        end

        def row_attributes
        end
      end
    end
  end
end
