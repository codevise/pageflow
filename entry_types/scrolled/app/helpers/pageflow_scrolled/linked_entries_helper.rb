module PageflowScrolled
  # Determine urls of entries that links point to.
  #
  # @api private
  module LinkedEntriesHelper
    include Pageflow::SocialShareHelper

    def scrolled_linked_entries(scrolled_entry, configurables)
      entry_ids = EntryLinkReferences.new(configurables.map(&:configuration)).entry_ids
      return [] if entry_ids.empty?

      Pageflow::Entry
        .where(id: entry_ids, account_id: scrolled_entry.account.id)
        .preload(:site, :account, :published_revision, :draft, permalink: :directory)
        .order(:id)
        .map do |entry|
          scrolled_linked_entry(entry, include_preview: !scrolled_entry.published_revision?)
        end
    end

    def scrolled_linked_entry(entry, include_preview: true)
      linked_entry = Pageflow::PublishedEntry.new(entry, entry.published_revision || entry.draft)
      result = {entry: linked_entry, url: social_share_entry_url(linked_entry)}

      return result unless include_preview

      result.merge(preview_url: main_app.preview_admin_entry_path(entry),
                   publication_state: entry.publication_state,
                   signature: EntryLinkSignature.generate(entry.id))
    end
  end
end
