module Pageflow
  ActiveAdmin.register Site, as: 'Site' do
    belongs_to :account

    menu false
    actions :index, :show, :new, :edit, :create, :update

    show do
      render('attributes_table', site:)

      tabs_view(Pageflow.config.admin_resource_tabs.find_by_resource(site),
                i18n: 'pageflow.admin.resource_tabs',
                authorize: :see_site_admin_tab,
                build_args: [site])
    end

    form partial: 'form'

    permit_params do
      [
        :name,
        :title,
        :cname,
        :additional_cnames,
        :feeds_enabled,
        :sitemap_enabled,
        :imprint_link_url,
        :imprint_link_label,
        :copyright_link_url,
        :copyright_link_label,
        :privacy_link_url,
        :home_url,
        :cutoff_mode_name,
        :custom_404_entry_id
      ] + permitted_admin_form_input_params
    end

    controller do
      helper Admin::CutoffModesHelper
      helper Admin::FormHelper
      helper Admin::SitesHelper
      helper Pageflow::PublicI18n::LocalesHelper

      before_create do |site|
        site.build_root_permalink_directory
      end

      def index
        redirect_to admin_account_path(parent, tab: 'sites')
      end

      private

      def permitted_admin_form_input_params
        Pageflow
          .config_for(parent)
          .admin_form_inputs
          .permitted_attributes_for(:site)
      end
    end
  end
end
