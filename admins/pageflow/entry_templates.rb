module Pageflow
  ActiveAdmin.register EntryTemplate, as: 'EntryTemplate' do
    menu false
    config.batch_actions = false
    actions :index, :new, :create, :edit, :update
    form partial: 'form'

    belongs_to :account, parent_class: Pageflow::Account

    breadcrumb do
      breadcrumb_links.first 3
    end

    controller do
      helper Pageflow::Admin::FormHelper
      helper Pageflow::Admin::WidgetsHelper

      def index
        redirect_to redirect_path
      end

      def new
        account = Account.find(params[:account_id])
        @entry_template = EntryTemplate.new(
          account: account,
          entry_type_name: params[:entry_type_name]
        )

        @page_title = page_title('new', params[:entry_type_name])

        super
      end

      def create
        @entry_template = EntryTemplate.new(
          entry_template_params.merge(account_id: permitted_params[:account_id])
        )
        @page_title = page_title('new', @entry_template.entry_type_name)
        authorize!(:create, @entry_template)
        create! { redirect_path }
        update_widgets if @entry_template.errors.empty?
      end

      def edit
        @page_title = page_title('edit', resource.entry_type_name)
        super
      end

      def update
        @entry_template = EntryTemplate.find(params[:id])
        @entry_template.assign_attributes(entry_template_params)
        @page_title = page_title('edit', @entry_template.entry_type_name)
        params[:entry_template].delete('share_providers')
        params[:entry_template].delete('configuration')
        authorize!(:update, @entry_template)
        update! { redirect_path }
        update_widgets if @entry_template.errors.empty?
      end

      private

      def page_title(rest_verb, entry_type_name)
        "#{I18n.t('pageflow.admin.entry_templates.page_title.' + rest_verb)} "\
        "#{I18n.t('activerecord.values.pageflow/entry.type_names.' + entry_type_name)}"
      end

      def permitted_params
        params.permit(
          :account_id,
          entry_template: permitted_entry_template_attributes
        )
      end

      def permitted_entry_template_attributes
        [
          :id,
          :account_id,
          :entry_type_name,
          :theme_name,
          :default_author,
          :default_publisher,
          :default_keywords,
          :default_locale,
          share_providers: {},
          configuration: {}
        ]
      end

      def redirect_path
        admin_account_path(params[:account_id], tab: 'entry_templates')
      end

      def entry_template_params
        current_params = permitted_params[:entry_template]&.to_hash

        if current_params
          config = true_false_strings_to_booleans_or_numbers(
            current_params['configuration']
          )
          share_providers = true_false_strings_to_booleans_or_numbers(
            current_params['share_providers']
          )
          current_params.merge('configuration' => config,
                               'share_providers' => share_providers)
        else
          {}
        end
      end

      def true_false_strings_to_booleans_or_numbers(hash)
        hash&.map { |k, v| [k, to_boolean_or_number(v)] }&.to_h
      end

      def to_boolean_or_number(value)
        case value
        when 'false'
          false
        when 'true'
          true
        when '0'
          0
        when '1'
          1
        else
          value
        end
      end

      def update_widgets
        resource.widgets&.batch_update!(widgets_params)
      end

      def widgets_params
        (params[:widgets].try(:permit!).to_h || {}).map do |role, type_name|
          {role: role, type_name: type_name}
        end
      end
    end
  end
end
