require 'spec_helper'

module Pageflow
  describe Quota do
    class TestQuota < Quota
      def initialize(account, state)
        super('test', account)
        @state = state
      end

      attr_reader :state

      def state_description
        nil
      end
    end

    describe '#verify_available!' do
      it 'raises ExhaustedError for exhausted quota' do
        account = build(:account)
        quota = TestQuota.new(account, 'exhausted')

        expect {
          quota.verify_available!
        }.to raise_error(Quota::ExhaustedError)
      end
    end

    describe '#verify_not_exceeded!' do
      it 'raises ExceededError for exceeded quota' do
        account = build(:account)
        quota = TestQuota.new(account, 'exceeded')

        expect {
          quota.verify_not_exceeded!
        }.to raise_error(Quota::ExceededError)
      end

      it 'does not raise for exhausted quota' do
        account = build(:account)
        quota = TestQuota.new(account, 'exhausted')

        expect {
          quota.verify_not_exceeded!
        }.not_to raise_error
      end
    end

    describe '#available?' do
      it 'returns true for available quota' do
        account = build(:account)
        quota = TestQuota.new(account, 'available')

        expect(quota).to be_available
      end

      it 'returns false for exhausted quota' do
        account = build(:account)
        quota = TestQuota.new(account, 'exhausted')

        expect(quota).not_to be_available
      end

      it 'returns false for exceeded quota' do
        account = build(:account)
        quota = TestQuota.new(account, 'exceeded')

        expect(quota).not_to be_available
      end
    end

    describe '#exhausted?' do
      it 'returns false for available quota' do
        account = build(:account)
        quota = TestQuota.new(account, 'available')

        expect(quota).not_to be_exhausted
      end

      it 'returns true for exhausted quota' do
        account = build(:account)
        quota = TestQuota.new(account, 'exhausted')

        expect(quota).to be_exhausted
      end

      it 'returns true for exceeded quota' do
        account = build(:account)
        quota = TestQuota.new(account, 'exceeded')

        expect(quota).to be_exhausted
      end
    end

    describe '#assume' do
      it 'returns same quota by default' do
        account = build(:account)
        quota = TestQuota.new(account, 'available')

        expect(quota.assume(some: 'information')).to be_available
      end
    end
  end
end
