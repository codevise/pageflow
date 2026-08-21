require 'spec_helper'
require 'pageflow/shared_contexts/fake_translations'

module Pageflow
  module Admin
    describe EntriesHelper do
      describe '#entry_comments_indicator' do
        def render_indicator(entry, user)
          allow(helper).to receive(:collection).and_return([entry])
          allow(helper).to receive(:current_user).and_return(user)

          helper.entry_comments_indicator(entry)
        end

        it 'renders nothing without unresolved threads' do
          user = create(:user)
          entry = create(:entry)

          expect(render_indicator(entry, user)).to be_nil
        end

        it 'renders the number of unresolved topics' do
          user = create(:user)
          entry = create(:entry)
          create(:comment_thread, revision: entry.draft)
          create(:comment_thread, revision: entry.draft)

          result = render_indicator(entry, user)

          expect(result).to have_selector('span.entry_comments_indicator', text: '2')
        end

        it 'marks the indicator when comments are unseen' do
          user = create(:user, unread_comments_since_at: 3.hours.ago)
          entry = create(:entry)
          thread = create(:comment_thread, revision: entry.draft)
          create(:comment, comment_thread: thread, creator: create(:user))

          result = render_indicator(entry, user)

          expect(result).to have_selector('span.entry_comments_indicator .unread_dot')
        end

        it 'does not mark the indicator when everything has been seen' do
          user = create(:user, unread_comments_since_at: Time.current)
          entry = create(:entry)
          create(:comment_thread, revision: entry.draft)

          result = render_indicator(entry, user)

          expect(result).to have_selector('span.entry_comments_indicator')
          expect(result).not_to have_selector('span.entry_comments_indicator .unread_dot')
        end

        it 'names the topic count in the tooltip' do
          user = create(:user, unread_comments_since_at: Time.current)
          entry = create(:entry)
          create(:comment_thread, revision: entry.draft)

          result = render_indicator(entry, user)

          expect(result).to have_selector("[data-tooltip='Comments: 1 unresolved topic']")
        end

        it 'renders summaries passed in instead of querying the collection' do
          user = create(:user)
          entry = create(:entry)
          create(:comment_thread, revision: entry.draft)
          summaries = EntryCommentSummary.for_entries([entry], user:)

          result = helper.entry_comments_indicator(entry, summaries:)

          expect(result).to have_selector('span.entry_comments_indicator', text: '1')
        end

        it 'names new topics and replies in the tooltip' do
          user = create(:user, unread_comments_since_at: 3.hours.ago)
          entry = create(:entry)
          thread = create(:comment_thread, revision: entry.draft)
          create(:comment, comment_thread: thread, creator: create(:user))
          create(:comment, comment_thread: thread, creator: create(:user))

          result = render_indicator(entry, user)

          expect(result).to have_selector(
            "[data-tooltip='Comments: 1 unresolved topic, 1 new topic, 1 new reply']"
          )
        end
      end

      describe '#entry_type_collection' do
        include_context 'fake translations'

        it 'returns collection items' do
          translation(I18n.locale,
                      'activerecord.values.pageflow/entry.type_names.phaged',
                      'Test Type')

          pageflow_configure do |config|
            config.entry_types.register(TestEntryType.new(name: 'phaged'))
          end

          result = helper.entry_type_collection

          expect(result).to include('Test Type' => 'phaged')
        end

        it 'supports passing in entry types' do
          translation(I18n.locale,
                      'activerecord.values.pageflow/entry.type_names.phaged',
                      'Test Type')

          result = helper.entry_type_collection([TestEntryType.new(name: 'phaged')])

          expect(result).to include('Test Type' => 'phaged')
        end
      end
    end
  end
end
