require 'spec_helper'

module Pageflow
  shared_examples 'a membership-based permission that' do |params|
    let(:user) { create(:user) }
    let(:topic) { instance_exec(&params[:topic]) }
    let(:entity) { of.call(topic) }
    let(:policy) { described_class.new(user, topic) }

    if !params[:of_entry] && !params[:of_account]
      fail('Speficy at least one of the following options: of_entry, of_account')
    end

    [:of_entry, :of_account].each do |membership_type|
      if params[membership_type]
        let(:of) { params[membership_type] }

        it "allows #{membership_type == :of_account ? 'account' : 'entry'} #{params[:allows]} " \
           "to #{params[:to]} respective " \
           "#{described_class.name.humanize.sub('Pageflow::policies::', '').chomp('policy')}" do
          create(:membership, user: user, entity: entity, role: params[:allows])

          expect(policy).to permit_action(params[:to])
        end

        it "does not allow #{membership_type == :of_account ? 'account' : 'entry'} " \
           "#{params[:allows]} to #{params[:to]} off-limits " \
           "#{described_class.name.humanize.sub('Pageflow::policies::', '').chomp('policy')}" do
          other_entity = (membership_type == :of_entry ? create(:entry) : create(:account))
          create(:membership, user: user, entity: other_entity, role: params[:allows])

          expect(policy).not_to permit_action(params[:to])
        end

        if params[:but_forbids].present?
          it "does not allow #{membership_type == :of_account ? 'account' : 'entry'} " \
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
    end
  end
end
