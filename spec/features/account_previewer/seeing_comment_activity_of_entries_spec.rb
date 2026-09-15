require 'spec_helper'

feature 'as account previewer, seeing comment activity in the entries table' do
  scenario 'entry without comments shows no indicator' do
    entry = create(:entry, title: 'Quiet Entry')
    Dom::Admin::Page.sign_in_as(:previewer, on: entry.account)

    visit(admin_entries_path)

    expect(Dom::Admin::EntryInIndexTable.find_by_title('Quiet Entry').comments_indicator)
      .to be_nil
  end

  scenario 'entry with unseen comments shows marked indicator naming them' do
    entry = create(:entry, title: 'Discussed Entry')
    user = Dom::Admin::Page.sign_in_as(:previewer, on: entry.account)
    user.update!(unread_comments_since_at: 1.day.ago)

    thread = create(:comment_thread, revision: entry.draft)
    create(:comment, comment_thread: thread, creator: create(:user))
    create(:comment, comment_thread: thread, creator: create(:user))

    visit(admin_entries_path)
    indicator = Dom::Admin::EntryInIndexTable.find_by_title('Discussed Entry')
                                             .comments_indicator

    expect(indicator).to have_text('1')
    expect(indicator).to match_selector('.unread')
    expect(indicator['data-tooltip'])
      .to eq('Comments: 1 unresolved topic, 1 unread topic, 1 unread reply')
  end

  scenario 'activity in threads the previewer has no part in does not notify' do
    entry = create(:entry, title: 'Busy Entry')
    user = Dom::Admin::Page.sign_in_as(:previewer, on: entry.account)
    user.update!(unread_comments_since_at: 1.day.ago)

    thread = create(:comment_thread, revision: entry.draft)
    create(:comment, comment_thread: thread, creator: create(:user))

    visit(admin_entries_path)
    indicator = Dom::Admin::EntryInIndexTable.find_by_title('Busy Entry').comments_indicator

    expect(indicator).to match_selector('.unread')
    expect(indicator).to have_no_selector('.notifying_dot')
  end

  scenario 'entry the previewer muted shows the level beside the count' do
    entry = create(:entry, title: 'Muted Entry')
    user = Dom::Admin::Page.sign_in_as(:previewer, on: entry.account)
    create(:entry_comment_notification_override, entry:, user:, level: 'muted')
    create(:comment_thread, revision: entry.draft)

    visit(admin_entries_path)
    row = Dom::Admin::EntryInIndexTable.find_by_title('Muted Entry')

    expect(row.comments_indicator['data-tooltip']).to eq('Comments: 1 unresolved topic')
    expect(row.comments_notification_level).to match_selector('.muted')
    expect(row.comments_notification_level['data-tooltip']).to eq('Muted')
  end

  scenario 'entry the previewer muted shows the level without any comments' do
    entry = create(:entry, title: 'Quiet Muted Entry')
    user = Dom::Admin::Page.sign_in_as(:previewer, on: entry.account)
    create(:entry_comment_notification_override, entry:, user:, level: 'muted')

    visit(admin_entries_path)
    row = Dom::Admin::EntryInIndexTable.find_by_title('Quiet Muted Entry')

    expect(row.comments_indicator).to be_nil
    expect(row.comments_notification_level).to match_selector('.muted')
  end

  scenario 'entry with comments predating the user shows unmarked indicator' do
    entry = create(:entry, title: 'Settled Entry')
    Dom::Admin::Page.sign_in_as(:previewer, on: entry.account)

    Timecop.travel(2.days.ago) do
      thread = create(:comment_thread, revision: entry.draft)
      create(:comment, comment_thread: thread, creator: create(:user))
    end

    visit(admin_entries_path)
    indicator = Dom::Admin::EntryInIndexTable.find_by_title('Settled Entry')
                                             .comments_indicator

    expect(indicator).to have_text('1')
    expect(indicator).not_to match_selector('.unread')
    expect(indicator['data-tooltip']).to eq('Comments: 1 unresolved topic')
  end
end
