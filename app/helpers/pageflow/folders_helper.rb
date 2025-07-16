module Pageflow
  module FoldersHelper
    def collection_for_folders(current_account, current_folder = nil)
      accounts = AccountPolicy::Scope
                 .new(current_user, Pageflow::Account)
                 .entry_creatable
                 .includes(:folders)
                 .where('pageflow_folders.id IS NOT NULL')
                 .order(:name, 'pageflow_folders.name')

      option_groups_from_collection_for_select(accounts,
                                               :folders,
                                               :name,
                                               :id,
                                               :name,
                                               selected: current_folder.try(:id),
                                               disabled: disabled_ids(accounts, current_account))
    end

    private

    def disabled_ids(accounts, current_account)
      folders_array = accounts.map(&:folders).to_a

      folders_array.delete_if do |account_folders|
        account_folders[0][:account_id] == current_account.id
      end

      folders_array.map(&:to_a).map { |account_folders|
        account_folders.map(&:id)
      }.flatten
    end
  end
end
