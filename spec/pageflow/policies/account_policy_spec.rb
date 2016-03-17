require 'spec_helper'

module Pageflow
  module Policies
    describe AccountPolicy do
      terms = {class: AccountPolicy,
               subject: FactoryGirl.create(:account),
               name: 'account'}
      terms[:entity] = terms[:subject]
      describe :publish do
        it_behaves_like 'a membership-based permission that',
                        terms: terms,
                        entity_type: :account,
                        permission_type: :publish,
                        minimum_required_role: 'publisher',
                        maximum_forbidden_role: 'editor'
      end
    end
  end
end
