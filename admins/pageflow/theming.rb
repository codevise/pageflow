module Pageflow
  ActiveAdmin.register Theming, :as => 'Theming' do
    menu false

    actions :show, :edit, :update

    form :partial => 'form'

    show do |theming|
      attributes_table_for theming do
        row :imprint_link_label
        row :imprint_link_url
        row :copyright_link_label
        row :copyright_link_url
        row :cname, :class => 'cname'
        row :created_at
      end
    end

    controller do
      def permitted_params
        params.permit(:theming => [:copyright_link_label, :copyright_link_url, :imprint_link_label, :imprint_link_url, :theme_id, :cname])
      end
    end
  end
end
