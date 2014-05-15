require 'spec_helper'

module Pageflow
  describe Quota do
    describe '#verify!' do
      class TestQuota
        include Quota

        def exceeded?(name, account)
          name == :exceeded
        end

        def state_description(name, account)
          nil
        end
      end

      it 'raises ExceededError for exceeded quota' do
        quota = TestQuota.new
        account = build(:account)

        expect {
          quota.verify!(:exceeded, account)
        }.to raise_error(Quota::ExceededError)
      end
    end
  end
end
