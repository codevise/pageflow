require 'spec_helper'

module Pageflow
  describe EditLock do
    describe 'active' do
      it 'excludes timed out EditLocks' do
        lock = create(:edit_lock, updated_at: (Time.now - EditLock.time_to_live - 1.minute))

        expect(EditLock.active).not_to include(lock)
      end
    end
    describe '#acquire' do
      context 'when held by other user' do
        it 'raises HeldByOtherUserError' do
          current_user = create(:user)
          other_user = create(:user)
          edit_lock = create(:edit_lock, user: other_user)

          expect {
            edit_lock.acquire(current_user)
          }.to raise_error(EditLock::HeldByOtherUserError)
        end

        it 'can be acquired with force option' do
          current_user = create(:user)
          other_user = create(:user)
          entry = create(:entry)
          edit_lock = create(:edit_lock, user: other_user, entry: entry)

          edit_lock.acquire(current_user, force: true)

          expect(entry.edit_lock).to be_held_by(current_user)
        end

        it 'can be acquired if timed out' do
          current_user = create(:user)
          other_user = create(:user)
          entry = create(:entry)
          edit_lock = create(:edit_lock, user: other_user, entry: entry)

          Timecop.freeze(Time.now + EditLock.time_to_live + 1.minute)
          edit_lock.acquire(current_user)

          expect(entry.edit_lock).to be_held_by(current_user)
        end
      end

      context 'when held by other session' do
        it 'raises HeldByOtherSessionError' do
          current_user = create(:user)
          edit_lock = create(:edit_lock, user: current_user)

          expect {
            edit_lock.acquire(current_user)
          }.to raise_error(EditLock::HeldByOtherSessionError)
        end

        it 'raises HeldByOtherSessionError for non matching id' do
          current_user = create(:user)
          edit_lock = create(:edit_lock, user: current_user)

          expect {
            edit_lock.acquire(current_user, id: 'other_id')
          }.to raise_error(EditLock::HeldByOtherSessionError)
        end

        it 'can be acquired with force option' do
          current_user = create(:user)
          entry = create(:entry)
          edit_lock = create(:edit_lock, user: current_user, entry: entry)

          edit_lock.acquire(current_user, id: 'other_id', force: true)

          expect(entry.edit_lock).to be_held_by(current_user)
        end

        it 'can be acquired if timed out' do
          current_user = create(:user)
          entry = create(:entry)
          edit_lock = create(:edit_lock, user: current_user, entry: entry)

          Timecop.freeze(Time.now + EditLock.time_to_live + 1.minute)
          edit_lock.acquire(current_user, id: 'other_id')

          expect(entry.edit_lock).to be_held_by(current_user)
        end
      end

      context 'when held by current user' do
        it 'returns quietly' do
          current_user = create(:user)
          entry = create(:entry)
          edit_lock = create(:edit_lock, user: current_user, entry: entry)

          expect {
            edit_lock.acquire(current_user, id: edit_lock.id)
          }.not_to raise_error
        end

        it 'does not create new lock even with force option' do
          current_user = create(:user)
          entry = create(:entry)
          edit_lock = create(:edit_lock, user: current_user, entry: entry)

          edit_lock.acquire(current_user, id: edit_lock.id, force: true)

          expect(entry.edit_lock).to be(edit_lock)
        end

        it 'deferres time out' do
          current_user = create(:user)
          entry = create(:entry)
          edit_lock = create(:edit_lock, user: current_user, entry: entry)

          Timecop.freeze(Time.now + EditLock.time_to_live + 1.minute)
          edit_lock.acquire(current_user, id: edit_lock.id)

          expect {
            edit_lock.acquire(current_user, id: 'other_id')
          }.to raise_error(EditLock::HeldByOtherSessionError)
        end
      end
    end

    describe '#verify!' do
      context 'when held by other user' do
        it 'raises HeldByOtherUserError' do
          current_user = create(:user)
          other_user = create(:user)
          edit_lock = create(:edit_lock, user: other_user)

          expect {
            edit_lock.verify!(current_user, id: 'other_id')
          }.to raise_error(EditLock::HeldByOtherUserError)
        end

        it 'raises HeldByOtherUserError even if timed out' do
          current_user = create(:user)
          other_user = create(:user)
          edit_lock = create(:edit_lock, user: other_user)

          Timecop.freeze(Time.now + EditLock.time_to_live + 1.minutes)

          expect {
            edit_lock.verify!(current_user, id: 'other_id')
          }.to raise_error(EditLock::HeldByOtherUserError)
        end
      end

      context 'when held by other session' do
        it 'raises HeldByOtherSessionError' do
          current_user = create(:user)
          edit_lock = create(:edit_lock, user: current_user)

          expect {
            edit_lock.verify!(current_user, id: 'other_id')
          }.to raise_error(EditLock::HeldByOtherSessionError)
        end

        it 'raises HeldByOtherSessionError even if timed out' do
          current_user = create(:user)
          edit_lock = create(:edit_lock, user: current_user)

          Timecop.freeze(Time.now + EditLock.time_to_live + 1.minutes)

          expect {
            edit_lock.verify!(current_user, id: 'other_id')
          }.to raise_error(EditLock::HeldByOtherSessionError)
        end
      end

      context 'when held by current user' do
        it 'returns quietly' do
          current_user = create(:user)
          entry = create(:entry)
          edit_lock = create(:edit_lock, user: current_user, entry: entry)

          expect {
            edit_lock.verify!(current_user, id: edit_lock.id)
          }.not_to raise_error
        end

        it 'deferres timeout if timed out' do
          current_user = create(:user)
          edit_lock = create(:edit_lock, user: current_user)

          Timecop.freeze(Time.now + EditLock.time_to_live + 1.minutes)
          edit_lock.verify!(current_user, id: edit_lock.id)

          expect {
            edit_lock.verify!(current_user, id: 'other_id')
          }.to raise_error(EditLock::HeldByOtherSessionError)
        end
      end
    end

    describe '#release' do
      context 'when held by current user' do
        it 'destroys edit lock' do
          current_user = create(:user)
          edit_lock = create(:edit_lock, user: current_user)

          edit_lock.release(current_user)

          expect(edit_lock).to be_destroyed
        end
      end

      context 'when held by other user' do
        it 'does not destroy edit lock' do
          current_user = create(:user)
          other_user = create(:user)
          edit_lock = create(:edit_lock, user: current_user)

          edit_lock.release(other_user)

          expect(edit_lock).to be_persisted
        end
      end
    end

    describe '::Null' do
      describe '#acquire' do
        it 'creates lock for current user' do
          current_user = create(:user)
          entry = create(:entry)
          edit_lock = EditLock::Null.new(entry)

          edit_lock.acquire(current_user)

          expect(entry.edit_lock).to be_held_by(current_user)
        end
      end

      describe '#verify!' do
        it 'raises NotHeldError' do
          current_user = create(:user)
          entry = create(:entry)
          edit_lock = EditLock::Null.new(entry)

          expect {
            edit_lock.verify!(current_user, id: 1)
          }.to raise_error(EditLock::NotHeldError)
        end
      end

      describe '#release' do
        it 'is noop' do
          edit_lock = EditLock::Null.new(create(:entry))

          expect {
            edit_lock.release(create(:user))
          }.not_to raise_error
        end
      end
    end
  end
end
