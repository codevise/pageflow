module PageflowScrolled
  module Editor
    # @api private
    class LinkableEntriesController < ActionController::Base
      include Pageflow::EditorController

      helper Pageflow::FilesHelper
      helper Pageflow::SocialShareHelper

      def index
        @linkable_entries = LinkableEntry.all(
          entries
            .preload(:site, :account, :published_revision, :draft, permalink: :directory)
            .order(:title),
          except: @entry
        )
      end

      def show
        @linkable_entry = LinkableEntry.find(entries, params[:id], except: @entry)
        head :not_found unless @linkable_entry
      end

      private

      def entries
        @entry.site.entries.accessible_by(current_ability, :read)
      end
    end
  end
end
