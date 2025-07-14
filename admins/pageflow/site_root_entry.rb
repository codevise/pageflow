module Pageflow
  ActiveAdmin.register_page 'Site Root Entry' do
    menu false

    breadcrumb do
      breadcrumb_links.first(1)
    end

    page_action :choose, method: [:get, :post] do
      @page_title = t('pageflow.admin.site_root_entry.title')

      @site_root_entry_form = SiteRootEntryForm.new(
        permitted_params[:site_root_entry_form],
        @site
      )

      if request.post? && @site_root_entry_form.save
        redirect_to(admin_entry_path(@site_root_entry_form.entry),
                    notice: t('pageflow.admin.site_root_entry.chosen'))
      end
    end

    controller do
      helper Admin::FormHelper

      before_action :find_site
      before_action :authorize_manage_root_entry!
      before_action :ensure_root_permalink_directory
      before_action :ensure_no_root_entry

      def index
        redirect_to(admin_account_name_setup_path)
      end

      private

      def find_site
        @site = Site.find(params[:site_id])
      end

      def authorize_manage_root_entry!
        authorize!(:manage_root_entry, @site)
      end

      def ensure_root_permalink_directory
        return if @site.root_permalink_directory.present?

        redirect_to(admin_root_path,
                    alert: t('pageflow.admin.site_root_entry.root_permalink_directory_required'))
      end

      def ensure_no_root_entry
        return if @site.root_entry.blank?

        redirect_to(admin_root_path,
                    alert: t('pageflow.admin.site_root_entry.root_entry_exists'))
      end

      def permitted_params
        params.permit(site_root_entry_form: [:entry_id])
      end
    end
  end
end
