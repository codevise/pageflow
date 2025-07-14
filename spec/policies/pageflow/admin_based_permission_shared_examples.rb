require 'spec_helper'

module Pageflow
  shared_examples 'an admin permission that' do |params|
    let(:topic) { instance_exec(&params[:topic]) }
    let(:of) { params[:of_account] }
    let(:account) { of.call(topic) }
    it "allows admin to #{params[:to]} all " \
       "#{described_class.name.humanize.sub('Pageflow::policies::', '')\
              .chomp('policy').pluralize}" do
      user = create(:user, :admin)
      policy = described_class.new(user, topic)

      expect(policy).to permit_action(params[:to])
    end

    if params[:allows_admins_but_forbids_even_managers].present?
      it "does not allow account manager to #{params[:to]} respective " \
         "#{described_class.name.humanize.sub('Pageflow::policies::', '').chomp('policy')}" do
        user = create(:user)
        policy = described_class.new(user, topic)
        create(:membership, user:, entity: account, role: :manager)

        expect(policy).not_to permit_action(params[:to])
      end
    end
  end
end
