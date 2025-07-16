module Pageflow
  module Admin
    # @api private
    class TabsView < ViewComponent
      builder_method :tabs_view

      attr_reader :tabs, :options

      def build(tabs, options = {})
        super(class: 'admin_tabs_view')

        @options = options
        @tabs = filter_tabs(tabs)

        build_tab_list
        build_tab_containers
      end

      private

      def filter_tabs(tabs)
        return tabs unless options[:authorize]

        tabs.select do |tab|
          authorized?(options[:authorize], tab)
        end
      end

      def build_tab_list
        ul(class: 'admin_tabs_view-tabs') do
          tabs.each do |tab|
            build_tab_item(tab)
          end
        end
      end

      def build_tab_item(tab)
        li(class: tab_class(tab.name)) do
          link_to(t(tab.name, scope: options[:i18n]), tab_href(tab.name))
        end
      end

      def tab_href(name)
        params = request.query_parameters.except(:page, :scope)
        params_string = params.merge(tab: name).to_param
        "?#{params_string}".html_safe
      end

      def build_tab_containers
        tabs.each do |tab|
          build_tab_container(tab)
        end
      end

      def build_tab_container(tab)
        div(class: tab_container_class(tab.name)) do
          insert_tag(tab.component, *options.fetch(:build_args, []))
        end
      end

      def tab_class(tab_name)
        [
          tab_name,
          current_tab?(tab_name) ? 'active' : nil
        ].compact.join(' ')
      end

      def tab_container_class(tab_name)
        [
          'admin_tabs_view-container',
          "admin_tabs_view-#{tab_name}_container",
          current_tab?(tab_name) ? 'active' : nil
        ].compact.join(' ')
      end

      def current_tab?(name)
        name.to_s == current_tab_name.to_s
      end

      def current_tab_name
        options[:current_tab] ||
          request.params[:tab] ||
          tabs.first.name
      end
    end
  end
end
