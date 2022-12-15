module Pageflow
  ActiveAdmin.register Site, as: 'Site' do
    menu false
    actions :index, :edit, :update

    form partial: 'form'

    permit_params do
      [
        :cname,
        :additional_cnames,
        :imprint_link_url,
        :imprint_link_label,
        :copyright_link_url,
        :copyright_link_label,
        :privacy_link_url,
        :home_url
      ] + permitted_admin_form_input_params
    end

    controller do
      helper Pageflow::Admin::FormHelper

      def index
        redirect_to admin_account_path(resource.account)
      end

      private

      def permitted_admin_form_input_params
        Pageflow
          .config_for(resource.account)
          .admin_form_inputs
          .permitted_attributes_for(:site)
      end
    end
  end
end
