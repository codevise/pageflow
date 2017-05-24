require 'spec_helper'

module Pageflow
  describe Admin::UserAccountsTab, type: :view_component do
    before do
      helper.extend(ActiveAdmin::ViewHelpers)
      helper.extend(Pageflow::Admin::MembershipsHelper)
      helper.extend(Rails.application.routes.url_helpers)

      allow(helper).to receive(:url_for)
      allow(helper).to receive(:authorized?).and_return(true)
    end

    %w[
      pageflow_accounts.name_desc
      pageflow_memberships.role_desc
      pageflow_memberships.created_at desc
    ].each do |order|
      it "can be sorted by #{order}" do
        user = create(:user)
        create(:account, with_member: user, name: 'Account 1')
        create(:account, with_publisher: user, name: 'Account 2')

        sign_in(user)
        params[:order] = order

        render(user)

        expect(rendered).to have_selector('table tr td', text: 'Account 1')
        expect(rendered).to have_selector('table tr td', text: 'Account 2')
      end
    end
  end
end
