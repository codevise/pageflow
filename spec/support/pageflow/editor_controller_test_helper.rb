require 'pageflow/edit_lock_test_helper'

module Pageflow
  # Helpers to test controllers that include
  # {Pageflow::EditorController}.
  #
  # @since 15.1
  module EditorControllerTestHelper
    extend ActiveSupport::Concern

    include EditLockTestHelpers
    include Devise::Test::ControllerHelpers

    # Sign in with user that has permission to edit the entry and
    # acquire an edit lock.
    def authorize_for_editor_controller(entry)
      user = FactoryBot.create(:user)
      FactoryBot.create(:membership, user: user, entity: entry, role: :editor)

      sign_in(user, scope: :user)
      acquire_edit_lock(user, entry)
    end
  end
end
