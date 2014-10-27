module Pageflow
  module Admin
    class TabsView < ViewComponent
      builder_method :tabs_view

      attr_reader :tabs, :options

      def build(tabs, options = {})
        super(class: 'admin_tabs_view')

        @tabs = tabs
        @options = options

        build_tab_list
        build_tab_containers
      end

      private

      def build_tab_list
        ul(class: 'tabs') do
          tabs.each do |tab_options|
            build_tab_item(tab_options)
          end
        end
      end

      def build_tab_item(tab_options)
        li(class: tab_class(tab_options[:name])) do
          link_to(t(tab_options[:name], scope: options[:i18n]), tab_href(tab_options[:name]))
        end
      end

      def tab_href(name)
        params = request.query_parameters.except(:page, :scope)
        params_string = params.merge(tab: name).to_param
        "?#{params_string}".html_safe
      end

      def build_tab_containers
        tabs.each do |tab_options|
          build_tab_container(tab_options)
        end
      end

      def build_tab_container(tab_options)
        div(class: tab_container_class(tab_options[:name])) do
          insert_tag(tab_options[:component], *options.fetch(:build_args, []))
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
          'tab_container',
          "#{tab_name}_tab_container",
          current_tab?(tab_name) ? 'active' : nil
        ].compact.join(' ')
      end

      def current_tab?(name)
        name.to_s == current_tab_name.to_s
      end

      def current_tab_name
        options[:current_tab] ||
          request.params[:tab] ||
          tabs.first[:name]
      end
    end
  end
end
