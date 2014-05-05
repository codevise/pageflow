module Pageflow
  module FoldersHelper
    def collection_for_folders(account)
      account.folders.order('name ASC')
    end
  end
end
