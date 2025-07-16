require 'spec_helper'

module Pageflow
  describe EntryPublication do
    describe '#exceeding?' do
      it 'passes published entry to quota\'s #assume method' do
        entry = create(:entry)
        user = create(:user)
        quota = QuotaDouble.available.new(:published_entries, entry.account)
        entry_publication = EntryPublication.new(entry, {}, quota, user)

        expect(quota).to receive(:assume).with(published_entry: entry).and_return(quota)

        entry_publication.exceeding?
      end

      it 'returns true if assumed quota is exceeded' do
        entry = create(:entry)
        user = create(:user)
        quota = QuotaDouble.exhausted.new(:published_entries, entry.account)
        entry_publication = EntryPublication.new(entry, {}, quota, user)

        allow(quota).to receive(:assume).and_return(QuotaDouble.exceeded.new(:published_entries,
                                                                             entry.account))

        expect(entry_publication).to be_exceeding
      end

      it 'returns false if assumed quota is exhausted' do
        entry = create(:entry)
        user = create(:user)
        quota = QuotaDouble.exhausted.new(:published_entries, entry.account)
        entry_publication = EntryPublication.new(entry, {}, quota, user)

        expect(entry_publication).not_to be_exceeding
      end

      it 'returns false if assumed quota is available' do
        entry = create(:entry)
        user = create(:user)
        quota = QuotaDouble.available.new(:published_entries, entry.account)
        entry_publication = EntryPublication.new(entry, {}, quota, user)

        expect(entry_publication).not_to be_exceeding
      end
    end

    describe 'save!' do
      it 'passes published entry to quota\'s #assume method' do
        user = create(:user)
        entry = create(:entry)
        quota = QuotaDouble.available.new(:published_entries, entry.account)
        entry_publication = EntryPublication.new(entry, {}, quota, user)

        expect(quota).to receive(:assume).with(published_entry: entry).and_return(quota)

        entry_publication.save!
      end

      it 'raises Quota::ExceededException if assumed quota is exceeded' do
        user = create(:user)
        entry = create(:entry)
        quota = QuotaDouble.exhausted.new(:published_entries, entry.account)
        entry_publication = EntryPublication.new(entry, {}, quota, user)

        allow(quota).to receive(:assume).and_return(QuotaDouble.exceeded.new(:published_entries,
                                                                             entry.account))

        expect {
          entry_publication.save!
        }.to raise_error(Quota::ExceededError)
      end

      it 'passes attributes and creator to Entry#publish' do
        entry = create(:entry)
        user = create(:user)
        quota = QuotaDouble.available.new(:published_entries, entry.account)
        entry_publication = EntryPublication.new(entry,
                                                 {published_until: 1.week.from_now},
                                                 quota,
                                                 user)

        expect(entry).to receive(:publish).with({creator: user, published_until: 1.week.from_now})

        entry_publication.save!
      end

      it 'invokes entry_published hooks' do
        entry = create(:entry)
        user = create(:user, :previewer, on: entry)
        quota = QuotaDouble.available.new(:published_entries, entry.account)
        entry_publication = EntryPublication.new(entry, {}, quota, user)
        subscriber = double('subscriber', call: nil)

        Pageflow.config.hooks.on(:entry_published, subscriber)
        entry_publication.save!

        expect(subscriber).to have_received(:call).with(entry:)
      end
    end
  end
end
