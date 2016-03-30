module Pageflow
  module FoldersHelper
    def collection_for_folders
      accounts = Policies::AccountPolicy::Scope.new(current_user, Pageflow::Account)
                                               .entry_creatable.includes(:folders)

      option_groups_from_collection_for_select(accounts, :folders, :name, :id, :name, nil)
    end
  end
end
