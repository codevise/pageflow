require 'spec_helper'

module Pageflow
  shared_examples 'a membership-based permission that' do |params|
    allowed_params = [
      :allows, :forbids, :but_forbids,
      :of_account, :of_entry, :of_entry_or_its_account,
      :to, :topic
    ]

    unknown_params = params.keys - allowed_params

    raise("Unknown params: #{unknown_params * ', '}") if unknown_params.any?

    if params[:of_entry_or_its_account]
      params[:of_entry] = params[:of_entry_or_its_account]

      params[:of_account] = lambda do |topic|
        entry = params[:of_entry_or_its_account].call(topic)
        entry.account
      end
    end

    if !params[:of_entry] && !params[:of_account]
      raise('Speficy at least one of the following options: of_entry, of_account')
    end

    params[:forbids] ||= params[:but_forbids]

    if !params[:allows] && !params[:forbids]
      raise('Specify at least one of the following options: allows, forbids')
    end

    topic_class_name = described_class.name.humanize.sub('Pageflow::', '').chomp('policy')

    let(:user) { create(:user) }
    let(:topic) { instance_exec(&params[:topic]) }
    let(:entity) { of.call(topic) }
    let(:policy) { described_class.new(user, topic) }

    [:of_entry, :of_account].each do |membership_type|
      next unless params[membership_type]

      # This context needs to be here to create a scope for the `let`
      # in the next line. Otherwise, when both the `:of_entry` and
      # `:of_account` params are present, the second iteration of the
      # loop will override the definition of the first, causing the
      # specs to be defined for the account case two times.
      context do
        let(:of) { params[membership_type] }

        if params[:allows].present?
          it "allows #{membership_type == :of_account ? 'account' : 'entry'} #{params[:allows]} " \
             "to #{params[:to]} respective #{topic_class_name}" do
            create(:membership, user:, entity:, role: params[:allows])

            expect(policy).to permit_action(params[:to])
          end

          it "does not allow #{membership_type == :of_account ? 'account' : 'entry'} " \
             "#{params[:allows]} to #{params[:to]} off-limits #{topic_class_name}" do
            other_entity = (membership_type == :of_entry ? create(:entry) : create(:account))
            create(:membership, user:, entity: other_entity, role: params[:allows])

            expect(policy).not_to permit_action(params[:to])
          end
        end

        if params[:forbids].present?
          it "does not allow #{membership_type == :of_account ? 'account' : 'entry'} " \
             "#{params[:forbids]} to #{params[:to]} respective #{topic_class_name}" do
            create(:membership, user:, entity:, role: params[:forbids])

            expect(policy).not_to permit_action(params[:to])
          end
        else
          it 'does not allow user without membership ' \
             "to #{params[:to]} respective #{topic_class_name}" do
            expect(policy).not_to permit_action(params[:to])
          end
        end
      end
    end
  end
end
