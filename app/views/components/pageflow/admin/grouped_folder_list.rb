module Pageflow
  module Admin
    # @api private
    class GroupedFolderList < ViewComponent
      builder_method :grouped_folder_list

      attr_reader :folders

      def build(folders, options = {})
        super(options.slice(:class))

        @folders = folders
        @active_id = options[:active_id]

        build_all_link

        if options[:grouped_by_accounts]
          build_folder_list_grouped_by_accounts
        else
          build_folder_list(folders)
        end
      end

      private

      def build_all_link
        ul(class: 'folders') do
          li('data-role' => 'all') do
            if @active_id
              link_to(t('pageflow.admin.folders.all'), main_app.admin_entries_path, class: 'name')
            else
              span(t('pageflow.admin.folders.all'), class: 'name')
            end
          end
        end
      end

      def build_folder_list_grouped_by_accounts
        ul(class: 'accounts') do
          folder_accounts.each do |account|
            li('data-id' => account.id) do
              h4(account.name, class: 'account-name')
              build_folder_list(folders_by_account(account))
            end
          end
        end
      end

      def build_folder_list(folders)
        ul(class: 'folders') do
          folders.each do |folder|
            li('data-id' => folder.id) do
              text_node(link_to_folder(folder))
              text_node(edit_folder_link(folder)) if authorized?(:configure_folder_on,
                                                                 folder.account)
              text_node(delete_folder_link(folder)) if authorized?(:configure_folder_on,
                                                                   folder.account)
            end
          end
        end
      end

      def link_to_folder(folder)
        link_to_unless(folder.id == @active_id.to_i,
                       folder.name,
                       main_app.admin_entries_path(folder_id: folder), class: 'name') do
          span(folder.name, Class: 'name')
        end
      end

      def edit_folder_link(folder)
        link_to(t('pageflow.admin.folders.edit'),
                main_app.edit_admin_folder_path(folder),
                title: t('pageflow.admin.folders.edit'),
                class: 'edit_folder')
      end

      def delete_folder_link(folder)
        link_to(t('pageflow.admin.folders.destroy'),
                main_app.admin_folder_path(folder),
                method: :delete,
                title: t('pageflow.admin.folders.destroy'),
                class: 'delete',
                data: {confirm: t('pageflow.admin.folders.confirm_destroy')})
      end

      def folders_by_account(account)
        @folders_by_accounts ||= folders.group_by(&:account_id)
        @folders_by_accounts[account.id]
      end

      def folder_accounts
        folders.map(&:account).uniq
      end
    end
  end
end
