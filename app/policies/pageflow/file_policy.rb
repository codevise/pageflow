module Pageflow
  # @api private
  class FilePolicy < ApplicationPolicy
    def initialize(user, file)
      @user = user
      @file = file
    end

    def manage?
      can_edit_any_entry_using_file?(@file.parent_file || @file)
    end

    def use?
      can_preview_any_entry_using_file?
    end

    private

    def can_preview_any_entry_using_file?
      previewer_of_any_entry_using_file_or_its_account?(@user, @file)
    end

    def previewer_of_any_entry_using_file_or_its_account?(user, file)
      entries_user_is_previewer_or_above_on = EntryPolicy::Scope
                                              .new(user, Entry).resolve
      (entries_user_is_previewer_or_above_on.map(&:id) & file.using_entry_ids).any?
    end

    def can_edit_any_entry_using_file?(file)
      editor_of_any_entry_using_file_or_its_account?(@user, file)
    end

    def editor_of_any_entry_using_file_or_its_account?(user, file)
      entries_user_is_editor_or_above_on = EntryPolicy::Scope
                                           .new(user, Entry).editor_or_above
      (entries_user_is_editor_or_above_on.map(&:id) & file.using_entry_ids).any?
    end
  end
end
