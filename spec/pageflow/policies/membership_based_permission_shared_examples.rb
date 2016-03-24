require 'spec_helper'

module Pageflow
  module Policies
    shared_examples 'a membership-based permission that' do |params|
      let(:user) { create(:user) }
      let(:topic) { instance_exec(&params[:topic]) }
      let(:of) { params[:of_account].present? ? params[:of_account] : params[:of_entry] }
      let(:entity) { of.call(topic) }
      let(:policy) { described_class.new(user, topic) }

      it "allows #{params[:of_account].present? ? 'account' : 'entry'} #{params[:allows]} " \
         "to #{params[:to]} respective " \
         "#{described_class.name.humanize.sub('Pageflow::policies::', '').chomp('policy')}" do
        create(:membership, user: user, entity: entity, role: params[:allows])

        expect(policy).to permit_action(params[:to])
      end

      it "does not allow #{params[:of_account].present? ? 'account' : 'entry'} " \
         "#{params[:allows]} to #{params[:to]} off-limits " \
         "#{described_class.name.humanize.sub('Pageflow::policies::', '').chomp('policy')}" do
        other_entity = (params[:entity_type] == :entry ? create(:entry) : create(:account))
        create(:membership, user: user, entity: other_entity, role: params[:allows])

        expect(policy).not_to permit_action(params[:to])
      end

      if params[:but_forbids].present?
        it "does not allow #{params[:of_account].present? ? 'account' : 'entry'} " \
           "#{params[:but_forbids]} to #{params[:to]} respective " \
         "#{described_class.name.humanize.sub('Pageflow::policies::', '').chomp('policy')}" do
          create(:membership, user: user, entity: entity, role: params[:but_forbids])

          expect(policy).not_to permit_action(params[:to])
        end
      else
        it 'does not allow user without membership ' \
           "to #{params[:to]} respective " \
         "#{described_class.name.humanize.sub('Pageflow::policies::', '').chomp('policy')}" do
          expect(policy).not_to permit_action(params[:to])
        end
      end
    end

    shared_examples 'a membership-based permission referring to entry and account that' do |params|
      params_entry = params.merge(of_entry: -> (topic) { topic })
      it_behaves_like 'a membership-based permission that', params_entry

      params_account = params.merge(of_account: -> (topic) { topic.account })
      it_behaves_like 'a membership-based permission that', params_account
    end
  end
end
