require 'spec_helper'

module Pageflow
  module Policies
    shared_examples 'a membership-based permission that' do |params|
      let(:user) { create(:user) }
      let(:entry) { create(:entry) }
      let(:entity) { params[:entity] == :entry ? entry : entry.account }
      let(:policy) { EntryPolicy.new(user, entry) }

      it "allows #{params[:entity]} #{params[:minimum_required_role]} " \
         "to #{params[:permission_type]} respective entry" do
        create(:membership, user: user, entity: entity, role: params[:minimum_required_role])

        expect(policy).to permit_action(params[:permission_type])
      end

      it "does not allow #{params[:entity]} #{params[:minimum_required_role]} " \
         "to #{params[:permission_type]} off-limits entry" do
        params[:entity] == :entry ? other_entity = create(:entry) : other_entity = create(:account)
        create(:membership, user: user, entity: other_entity, role: params[:minimum_required_role])

        expect(policy).not_to permit_action(params[:permission_type])
      end

      if params[:maximum_forbidden_role].present?
        it "does not allow #{params[:entity]} #{params[:maximum_forbidden_role]} " \
           "to #{params[:permission_type]} respective entry" do
          create(:membership, user: user, entity: entity, role: params[:maximum_forbidden_role])

          expect(policy).not_to permit_action(params[:permission_type])
        end
      else
        it 'does not allow user without membership ' \
           "to #{params[:permission_type]} respective entry" do
          expect(policy).not_to permit_action(params[:permission_type])
        end
      end
    end

    shared_examples 'for entry and account' do |params|
      params_entry = params.merge(entity: :entry)
      it_behaves_like 'a membership-based permission that', params_entry

      params_account = params.merge(entity: :account)
      it_behaves_like 'a membership-based permission that', params_account
    end
  end
end
