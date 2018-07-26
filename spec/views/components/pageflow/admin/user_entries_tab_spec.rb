require 'spec_helper'

module Pageflow
  describe Admin::UserEntriesTab, type: :view_component do
    before do
      helper.extend(ActiveAdmin::ViewHelpers)
      helper.extend(Pageflow::Admin::MembershipsHelper)
      helper.extend(Rails.application.routes.url_helpers)

      allow(helper).to receive(:url_for)
      allow(helper).to receive(:authorized?).and_return(true)

      stub_active_admin_config
    end

    %w[
      pageflow_entries.title_desc
      pageflow_accounts.name_desc
      pageflow_memberships.role_desc
      pageflow_memberships.created_at desc
    ].each do |order|
      it "can be sorted by #{order}" do
        user = create(:user)
        create(:entry, with_editor: user, title: 'Entry 1')
        create(:entry, with_publisher: user, title: 'Entry 2')

        sign_in(user, scope: :user)
        params[:order] = order

        render(user)

        expect(rendered).to have_selector('table tr td', text: 'Entry 1')
        expect(rendered).to have_selector('table tr td', text: 'Entry 2')
      end
    end
  end
end
