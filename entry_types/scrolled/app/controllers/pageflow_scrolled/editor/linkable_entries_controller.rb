module PageflowScrolled
  module Editor
    # @api private
    class LinkableEntriesController < ActionController::Base
      include Pageflow::EditorController

      helper PageflowScrolled::LinkedEntriesHelper

      def index
        @entries = Pageflow::Entry
                   .accessible_by(current_ability, :read)
                   .where(account: @entry.account, fragment_library: nil)
                   .where.not(id: @entry.id)
                   .preload(:site, :account, :published_revision, :draft, permalink: :directory)
                   .order(:title)
      end
    end
  end
end
