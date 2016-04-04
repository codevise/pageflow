module Pageflow
  module FoldersHelper
    def collection_for_folders
      accounts = Policies::AccountPolicy::Scope.new(current_user, Pageflow::Account)
                 .entry_creatable.includes(:folders).where('pageflow_folders.id IS NOT NULL')
                 .order(:name, 'pageflow_folders.name')

      option_groups_from_collection_for_select(accounts, :folders, :name, :id, :name, nil)
    end
  end
end
