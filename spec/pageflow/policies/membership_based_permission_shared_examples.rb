require 'spec_helper'

module Pageflow
  module Policies
    shared_examples 'a membership-based permission that' do |params|
      let(:user) { create(:user) }
      let(:subject) { params[:terms][:subject] }
      let(:entity) { params[:terms][:entity] }
      let(:policy) { params[:terms][:class].new(user, subject) }

      it "allows #{params[:entity_type]} #{params[:minimum_required_role]} " \
         "to #{params[:permission_type]} respective #{params[:terms][:name]}" do
        create(:membership, user: user, entity: entity, role: params[:minimum_required_role])

        expect(policy).to permit_action(params[:permission_type])
      end

      it "does not allow #{params[:entity_type]} #{params[:minimum_required_role]} " \
         "to #{params[:permission_type]} off-limits #{params[:terms][:name]}" do
        other_entity = (params[:entity_type] == :entry ? create(:entry) : create(:account))
        create(:membership, user: user, entity: other_entity, role: params[:minimum_required_role])

        expect(policy).not_to permit_action(params[:permission_type])
      end

      if params[:maximum_forbidden_role].present?
        it "does not allow #{params[:entity_type]} #{params[:maximum_forbidden_role]} " \
           "to #{params[:permission_type]} respective #{params[:terms][:name]}" do
          create(:membership, user: user, entity: entity, role: params[:maximum_forbidden_role])

          expect(policy).not_to permit_action(params[:permission_type])
        end
      else
        it 'does not allow user without membership ' \
           "to #{params[:permission_type]} respective #{params[:terms][:name]}" do
          expect(policy).not_to permit_action(params[:permission_type])
        end
      end
    end

    shared_examples 'for entry and account' do |params|
      params_entry = params.merge(entity_type: :entry)
      params_entry[:terms][:entity] = params[:terms][:subject]
      it_behaves_like 'a membership-based permission that', params_entry

      params_account = params.merge(entity_type: :account)
      params_account[:terms].merge!(entity: params[:terms][:subject].account)
      it_behaves_like 'a membership-based permission that', params_account
    end
  end
end
