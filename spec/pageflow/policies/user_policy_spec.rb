require 'spec_helper'

module Pageflow
  module Policies
    describe UserPolicy do
      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_account: -> (topic) { topic.membership_accounts.first },
                      to: :read,
                      topic: -> { create(:user, :member, on: create(:account)) }
    end
  end
end
