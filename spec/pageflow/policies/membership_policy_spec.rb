require 'spec_helper'

module Pageflow
  module Policies
    describe MembershipPolicy do
      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_entry: -> (topic) { topic.entity },
                      to: :create,
                      topic: -> { create(:entry_membership) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_account: -> (topic) { topic.entity },
                      to: :create,
                      topic: -> { create(:account_membership) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_entry: -> (topic) { topic.entity },
                      to: :edit_role,
                      topic: -> { create(:entry_membership) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_account: -> (topic) { topic.entity },
                      to: :edit_role,
                      topic: -> { create(:account_membership) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_entry: -> (topic) { topic.entity },
                      to: :destroy,
                      topic: -> { create(:entry_membership) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'manager',
                      but_forbids: 'publisher',
                      of_account: -> (topic) { topic.entity },
                      to: :destroy,
                      topic: -> { create(:account_membership) }
    end
  end
end
