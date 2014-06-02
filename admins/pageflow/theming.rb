module Pageflow
  ActiveAdmin.register Theming, :as => 'Theming'  do
    menu false

    actions :show, :edit, :update

    form :partial => 'form'

    controller do
      def show
        redirect_to(admin_entries_path)
      end

      def permitted_params
        params.permit(:theming => [:copyright_link_label, :copyright_link_url, :imprint_link_label, :imprint_link_url, :theme_id, :account_attributes => [:cname]])
      end
    end

  end
end
