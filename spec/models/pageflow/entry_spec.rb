require 'spec_helper'

module Pageflow
  describe Entry do
    context 'on create' do
      it 'creates a draft' do
        entry = create(:entry)

        expect(entry.draft).to be_present
      end

      it 'sets draft home_button_enabled to home_button_enabled_by_default of accounts default_theming' do
        theming = create(:theming, home_button_enabled_by_default: true)
        entry = create(:entry, theming: theming)

        expect(entry.draft.home_button_enabled).to eq(theming.home_button_enabled_by_default)
      end
    end

    context 'validation' do
      it 'ensures folder belongs to same account' do
        folder = build(:folder, :account => build_stubbed(:account))
        entry = build(:entry, :account => build_stubbed(:account))

        entry.folder = folder

        expect(entry).to have(1).error_on(:folder)
      end
    end

    describe '#publish' do
      it 'creates a revision' do
        creator = create(:user)
        entry = create(:entry)

        expect {
          entry.publish(:creator => creator)
        }.to change { entry.revisions.count }
      end

      it 'publishes the entry' do
        creator = create(:user)
        entry = create(:entry)

        entry.publish(:creator => creator)

        expect(entry).to be_published
      end

      it 'depublishes eariler revisions' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, :entry => entry, :published_at => 1.week.ago)

        entry.publish(:creator => creator)

        expect(earlier_revision.reload).not_to be_published
      end

      it 'saves creator' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.publish(:creator => creator)

        expect(revision.creator).to be(creator)
      end

      it 'freezes created revision' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.publish(:creator => creator)

        expect(revision).to be_frozen
      end

      context 'with :published_until option' do
        it 'publishes entry directly' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(:published_until => 1.month.from_now, :creator => creator)

          expect(entry).to be_published
        end

        it 'schedules depublication' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(:published_until => 1.month.from_now, :creator => creator)

          Timecop.freeze(1.month.from_now) do
            expect(entry).not_to be_published
          end
        end
      end
    end

    describe '#restore' do
      it 'creates a revision' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, :entry => entry)

        expect {
          entry.restore(:revision => earlier_revision, :creator => creator)
        }.to change { entry.revisions.count }
      end

      it 'freezes previous draft' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, :entry => entry)

        draft_before_restore = entry.draft
        entry.restore(:revision => earlier_revision, :creator => creator)

        expect(draft_before_restore.reload).to be_frozen
      end

      it 'turns previous draft into snapshot of type before_restore' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, :entry => entry)

        draft_before_restore = entry.draft
        revision = entry.restore(:revision => earlier_revision, :creator => creator)

        expect(draft_before_restore.reload.snapshot_type).to eq('before_restore')
      end

      context 'for published revision' do
        it 'turns copy of passed revision into new draft' do
          creator = create(:user)
          entry = create(:entry)
          earlier_revision = create(:revision, :published, :title => 'the way it was', :entry => entry)

          entry.restore(:revision => earlier_revision, :creator => creator)

          expect(entry.draft(true).title).to eq('the way it was')
        end
      end

      context 'for frozen revision' do
        it 'turns copy of passed revision into new draft' do
          creator = create(:user)
          entry = create(:entry)
          earlier_revision = create(:revision, :frozen, :title => 'the way it was', :entry => entry)

          entry.restore(:revision => earlier_revision, :creator => creator)

          expect(entry.draft(true).title).to eq('the way it was')
        end
      end

      it 'saves creator in previous draft' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, :entry => entry)

        draft_before_restore = entry.draft
        revision = entry.restore(:revision => earlier_revision, :creator => creator)

        expect(draft_before_restore.reload.creator).to eq(creator)
      end

      it 'saves which revision was restored from' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, :entry => entry)

        revision = entry.restore(:revision => earlier_revision, :creator => creator)

        expect(entry.draft(true).restored_from).to eq(earlier_revision)
      end
    end

    describe '#snaphot' do
      it 'creates a revision' do
        creator = create(:user)
        entry = create(:entry)

        expect {
          entry.snapshot(:creator => creator)
        }.to change { entry.revisions.count }
      end

      it 'saves creator' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.snapshot(:creator => creator)

        expect(revision.creator).to be(creator)
      end

      it 'freezes created revision' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.snapshot(:creator => creator)

        expect(revision).to be_frozen
      end

      it 'sets snapshot type to auto' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.snapshot(:creator => creator)

        expect(revision.snapshot_type).to eq('auto')
      end

      it 'allows to set snapshot type to user' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.snapshot(:creator => creator, :type => 'user')

        expect(revision.snapshot_type).to eq('user')
      end
    end
  end
end
