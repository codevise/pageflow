require 'spec_helper'

feature 'as account previewer, filtering entries by attributes' do
  scenario 'filtering by publication date' do
    account = create(:account)
    user = Dom::Admin::Page.sign_in_as(:previewer, on: account)
    matching_entry = create(:entry,
                            :published,
                            account:,
                            with_previewer: user,
                            published_revision_attributes: {
                              published_at: 40.days.ago
                            })
    other_entry = create(:entry,
                         :published,
                         account:,
                         with_previewer: user,
                         published_revision_attributes: {
                           published_at: 2.days.ago
                         })

    visit(admin_entries_path)
    filter_form = Dom::Admin::FilterForm.find!
    filter_form.fill_in_date_range(:published_revision_published_at,
                                   from: 2.month.ago,
                                   to: 1.month.ago)
    filter_form.submit

    expect(Dom::Admin::EntryInIndexTable.find_by_title(matching_entry.title)).to be_present
    expect(Dom::Admin::EntryInIndexTable.find_by_title(other_entry.title)).not_to be_present
  end
end
