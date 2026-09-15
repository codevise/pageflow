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

        it 'leaves the level out of the indicator' do
          user = create(:user)
          entry = create(:entry)
          create(:comment_thread, revision: entry.draft)
          create(:entry_comment_notification_override, entry:, user:, level: 'muted')

          result = render_indicator(entry, user)

          expect(result).not_to have_selector('.comment_notification_level')
          expect(result).to have_selector("[data-tooltip='Comments: 1 unresolved topic']")
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

          expect(result).to have_selector('span.entry_comments_indicator.unread')
        end

        it 'adds a dot when the activity is waiting for the user' do
          user = create(:user, unread_comments_since_at: 3.hours.ago)
          entry = create(:entry, with_previewer: user)
          thread = create(:comment_thread, revision: entry.draft)
          create(:comment, comment_thread: thread, creator: create(:user))

          result = render_indicator(entry, user)

          expect(result).to have_selector('.entry_comments_indicator.unread .notifying_dot')
        end

        it 'leaves the dot out when the activity is addressed to somebody else' do
          user = create(:user, unread_comments_since_at: 3.hours.ago)
          entry = create(:entry, account: create(:account, with_previewer: user))
          thread = create(:comment_thread, revision: entry.draft)
          create(:comment, comment_thread: thread, creator: create(:user))

          result = render_indicator(entry, user)

          expect(result).to have_selector('.entry_comments_indicator.unread')
          expect(result).not_to have_selector('.notifying_dot')
        end

        it 'does not mark the indicator when everything has been seen' do
          user = create(:user, unread_comments_since_at: Time.current)
          entry = create(:entry)
          create(:comment_thread, revision: entry.draft)

          result = render_indicator(entry, user)

          expect(result).to have_selector('span.entry_comments_indicator')
          expect(result).not_to have_selector('span.entry_comments_indicator.unread')
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

        it 'names unread topics and replies in the tooltip' do
          user = create(:user, unread_comments_since_at: 3.hours.ago)
          entry = create(:entry)
          thread = create(:comment_thread, revision: entry.draft)
          create(:comment, comment_thread: thread, creator: create(:user))
          create(:comment, comment_thread: thread, creator: create(:user))

          result = render_indicator(entry, user)

          expect(result).to have_selector(
            "[data-tooltip='Comments: 1 unresolved topic, 1 unread topic, 1 unread reply']"
          )
        end

        it 'names a newly resolved topic in the tooltip' do
          user = create(:user, unread_comments_since_at: 3.hours.ago)
          entry = create(:entry)
          thread = create(:comment_thread, revision: entry.draft, resolved_at: 1.hour.ago,
                                           resolver: create(:user))
          create(:comment, comment_thread: thread, creator: user, created_at: 2.hours.ago)

          result = render_indicator(entry, user)

          expect(result).to have_selector(
            "[data-tooltip='Comments: 0 unresolved topics, 1 newly resolved topic']"
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

      describe '#entry_comments_notification_level' do
        def render_level(entry, user)
          allow(helper).to receive(:collection).and_return([entry])
          allow(helper).to receive(:current_user).and_return(user)

          helper.entry_comments_notification_level(entry)
        end

        it 'renders the level the user set for the entry' do
          user = create(:user)
          entry = create(:entry)
          create(:comment_thread, revision: entry.draft)
          create(:entry_comment_notification_override, entry:, user:, level: 'muted')

          result = render_level(entry, user)

          expect(result).to have_selector('.comment_notification_level.muted')
          expect(result).to have_selector("[data-tooltip='Muted']")
        end

        it 'renders the level for an entry nobody has commented on' do
          user = create(:user)
          entry = create(:entry)
          create(:entry_comment_notification_override, entry:, user:, level: 'muted')

          result = render_level(entry, user)

          expect(result).to have_selector('.comment_notification_level.muted')
        end

        it 'renders nothing for a level the user has not set' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)
          create(:comment_thread, revision: entry.draft)

          expect(render_level(entry, user)).to be_nil
        end
      end
    end
  end
end
