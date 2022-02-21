require 'spec_helper'
require 'percy/capybara'

feature 'entry index page', js: true do
  let :snapshot_name do |example|
    example.metadata[:description]
  end

  scenario 'table with folder list' do
    account = create(:account)
    member1 = create(:user, :member, on: account)
    member2 = create(:user, :member, on: account)
    create(:entry, account: account, with_previewer: member1)
    create(:entry, account: account, with_previewer: member1, with_editor: member2)

    Dom::Admin::Page.sign_in_as(:manager, on: account)
    visit(admin_entries_path)
    puts "sleep"
    sleep 5
    snapshot
  end

  def snapshot
    page.percy_snapshot(snapshot_name)
  end
end
