require 'spec_helper'

module Pageflow
  describe Entry do
    context 'on create' do
      it 'creates a draft' do
        entry = create(:entry)

        expect(entry.draft).to be_present
      end

      it 'can skip draft creation' do
        entry = create(:entry, skip_draft_creation: true)

        expect(entry.draft).to be_blank
      end

      it 'sets draft home_button_enabled to home_button_enabled_by_default of accounts default_theming' do
        theming = create(:theming, home_button_enabled_by_default: true)
        entry = create(:entry, theming: theming)

        expect(entry.draft.home_button_enabled).to eq(theming.home_button_enabled_by_default)
      end

      it 'copies widgets from theming to draft' do
        theming = create(:theming)
        create(:widget, subject: theming, role: 'header', type_name: 'theming_header')
        entry = create(:entry, theming: theming)

        expect(entry.draft.widgets).to include_record_with(role: 'header', type_name: 'theming_header')
      end

      it 'creates a first storyline in the draft' do
        entry = create(:entry)

        expect(entry.draft.storylines).not_to be_empty
      end
    end

    context 'validation' do
      it 'ensures folder belongs to same account' do
        folder = build(:folder, account: build_stubbed(:account))
        entry = build(:entry, account: build_stubbed(:account))

        entry.folder = folder

        expect(entry).to have(1).error_on(:folder)
      end
    end

    describe '#publish' do
      it 'creates a revision' do
        creator = create(:user)
        entry = create(:entry)

        expect {
          entry.publish(creator: creator)
        }.to change { entry.revisions.count }
      end

      it 'publishes the entry' do
        creator = create(:user)
        entry = create(:entry)

        entry.publish(creator: creator)

        expect(entry).to be_published
      end

      it 'resets cached published_revision' do
        creator = create(:user)
        entry = create(:entry, :published)

        revision = entry.published_revision
        entry.publish(creator: creator)

        expect(entry.published_revision).not_to eq(revision)
      end

      it 'depublishes eariler revisions' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, entry: entry, published_at: 1.week.ago)

        entry.publish(creator: creator)

        expect(earlier_revision.reload).not_to be_published
      end

      it 'saves creator' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.publish(creator: creator)

        expect(revision.creator).to be(creator)
      end

      it 'freezes created revision' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.publish(creator: creator)

        expect(revision).to be_frozen
      end

      it 'sets first_published_at on first publication' do
        creator = create(:user)
        entry = create(:entry)

        entry.publish(creator: creator)

        expect(entry.first_published_at).to be_present
      end

      it 'does not set first_published_at if it is already present' do
        creator = create(:user)
        entry = create(:entry, first_published_at: 1.day.ago)

        entry.publish(creator: creator)

        expect(entry.first_published_at).to eq(1.day.ago)
      end

      context 'with :published_until option' do
        it 'publishes entry directly' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(published_until: 1.month.from_now, creator: creator)

          expect(entry).to be_published
        end

        it 'schedules depublication' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(published_until: 1.month.from_now, creator: creator)

          Timecop.freeze(1.month.from_now) do
            expect(entry).not_to be_published
          end
        end
      end

      context 'with :password and :password_protected option' do
        it 'publishes entry with password protection' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(creator: creator,
                        password_protected: true,
                        password: 'abc123abc')

          expect(entry).to be_published_with_password('abc123abc')
        end
      end

      context 'with :password options but with :password_protected option false' do
        it 'publishes entry without password protection' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(creator: creator,
                        password_protected: false,
                        password: 'abc123abc')

          expect(entry).to be_published_without_password
        end

        it 'does not store password' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(creator: creator,
                        password_protected: false,
                        password: 'abc123abc')

          expect {
            entry.publish(creator: creator,
                          password_protected: true)
          }.to raise_error(Entry::PasswordMissingError)
        end

        it 'forgets password' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(creator: creator,
                        password_protected: true,
                        password: 'abc123abc')
          entry.publish(creator: creator,
                        password_protected: false)

          expect {
            entry.publish(creator: creator,
                          password_protected: true)
          }.to raise_error(Entry::PasswordMissingError)
        end
      end

      context 'with :password_protected but without :password option' do
        it 'publishes entry with same password previously published with' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(creator: creator,
                        password_protected: true,
                        password: 'abc123abc')
          entry.publish(creator: creator,
                        password_protected: true)

          expect(entry).to be_published_with_password('abc123abc')
        end

        it 'fails if entry has not been published yet' do
          creator = create(:user)
          entry = create(:entry)

          expect {
            entry.publish(creator: creator,
                          password_protected: true)
          }.to raise_error(Entry::PasswordMissingError)
        end

        it 'fails if entry was previously published without password protection' do
          creator = create(:user)
          entry = create(:entry)

          entry.publish(creator: creator)

          expect {
            entry.publish(creator: creator,
                          password_protected: true)
          }.to raise_error(Entry::PasswordMissingError)
        end
      end
    end

    describe '#restore' do
      it 'creates a revision' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, entry: entry)

        expect {
          entry.restore(revision: earlier_revision, creator: creator)
        }.to change { entry.revisions.count }
      end

      it 'freezes previous draft' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, entry: entry)

        draft_before_restore = entry.draft
        entry.restore(revision: earlier_revision, creator: creator)

        expect(draft_before_restore.reload).to be_frozen
      end

      it 'turns previous draft into snapshot of type before_restore' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, entry: entry)

        draft_before_restore = entry.draft
        entry.restore(revision: earlier_revision, creator: creator)

        expect(draft_before_restore.reload.snapshot_type).to eq('before_restore')
      end

      context 'for published revision' do
        it 'turns copy of passed revision into new draft' do
          creator = create(:user)
          entry = create(:entry)
          earlier_revision = create(:revision, :published, title: 'the way it was', entry: entry)

          entry.restore(revision: earlier_revision, creator: creator)

          expect(entry.draft(true).title).to eq('the way it was')
        end

        it 'resets password_protected flag' do
          creator = create(:user)
          entry = create(:entry)
          earlier_revision = create(:revision,
                                    :published,
                                    title: 'the way it was',
                                    entry: entry,
                                    password_protected: true)

          entry.restore(revision: earlier_revision, creator: creator)

          expect(entry.draft(true)).not_to be_password_protected
        end
      end

      context 'for frozen revision' do
        it 'turns copy of passed revision into new draft' do
          creator = create(:user)
          entry = create(:entry)
          earlier_revision = create(:revision, :frozen, title: 'the way it was', entry: entry)

          entry.restore(revision: earlier_revision, creator: creator)

          expect(entry.draft(true).title).to eq('the way it was')
        end
      end

      it 'saves creator in previous draft' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, entry: entry)

        draft_before_restore = entry.draft
        entry.restore(revision: earlier_revision, creator: creator)

        expect(draft_before_restore.reload.creator).to eq(creator)
      end

      it 'saves which revision was restored from' do
        creator = create(:user)
        entry = create(:entry)
        earlier_revision = create(:revision, :published, entry: entry)

        entry.restore(revision: earlier_revision, creator: creator)

        expect(entry.draft(true).restored_from).to eq(earlier_revision)
      end
    end

    describe '#snaphot' do
      it 'creates a revision' do
        creator = create(:user)
        entry = create(:entry)

        expect {
          entry.snapshot(creator: creator)
        }.to change { entry.revisions.count }
      end

      it 'saves creator' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.snapshot(creator: creator)

        expect(revision.creator).to be(creator)
      end

      it 'freezes created revision' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.snapshot(creator: creator)

        expect(revision).to be_frozen
      end

      it 'sets snapshot type to auto' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.snapshot(creator: creator)

        expect(revision.snapshot_type).to eq('auto')
      end

      it 'allows to set snapshot type to user' do
        creator = create(:user)
        entry = create(:entry)

        revision = entry.snapshot(creator: creator, type: 'user')

        expect(revision.snapshot_type).to eq('user')
      end
    end
  end

  describe '#duplicate' do
    it 'creates a new entry' do
      entry = create(:entry)

      expect { entry.duplicate }.to change { Entry.count }
    end
  end
end
