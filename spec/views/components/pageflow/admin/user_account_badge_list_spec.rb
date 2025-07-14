require 'spec_helper'

module Pageflow
  describe Admin::UserAccountBadgeList, type: :view_component do
    it 'renders only accounts the current user is member of' do
      current_user = create(:user)
      user = create(:user)
      common_account = create(:account, name: 'Common')
      other_account = create(:account, name: 'Other')
      create(:membership, user: current_user, entity: common_account, role: :manager)
      create(:membership, user:, entity: common_account)
      create(:membership, user:, entity: other_account)

      allow(helper).to receive(:current_ability).and_return(Ability.new(current_user))
      allow(helper).to receive(:authorized?).and_return(true)

      render(current_user)

      expect(rendered).to have_selector('li', text: /Common/)
      expect(rendered).not_to have_selector('li', text: /Other/)
    end
  end
end
