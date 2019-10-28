require 'spec_helper'

module Pageflow
  describe RevisionComponent do
    it 'touches revision on create' do
      revision = create(:revision)

      expect {
        Timecop.freeze(1.minute.from_now) do
          TestRevisionComponent.create!(revision: revision)
        end
      }.to(change { revision.reload.updated_at })
    end

    describe '#perma_id' do
      it 'is set on creation' do
        revision = create(:revision)
        revision_component = TestRevisionComponent.create!(revision: revision)

        expect(revision_component.perma_id).to be_present
      end

      it 'differs for separate RevisonComponents' do
        revision = create(:revision)
        revision_component1 = TestRevisionComponent.create!(revision: revision)
        revision_component2 = TestRevisionComponent.create!(revision: revision)

        expect(revision_component1.perma_id).not_to eq(revision_component2.perma_id)
      end
    end

    describe '#copy_to' do
      it 'keeps perma_id' do
        revision = create(:revision)
        revision_component = TestRevisionComponent.create!(revision: revision)
        other_revision = create(:revision)

        revision_component.copy_to(other_revision)
        revision_component_copy = TestRevisionComponent.all_for_revision(other_revision).first
        expect(revision_component.perma_id).to eq(revision_component_copy.perma_id)
      end
    end

    describe '.from_perma_ids' do
      it 'returns list of RevisionComponents' do
        revision = create(:revision)
        revision_component = TestRevisionComponent.create!(revision: revision)

        components = TestRevisionComponent.from_perma_ids(revision, [revision_component.perma_id])

        expect(components).to eq([revision_component])
      end
    end

    describe 'creating records concurrently' do
      # It is important to use different revisions inside threads to
      # prevent deadlocks. Each test is wrapped in a
      # transaction. Creating a revision creates a lock for its row.
      # Creating a revision component tries to touch the revision. The
      # update waits for the lock to be released, which does not
      # happen before the test ends.
      #
      # See also
      # https://dev.mysql.com/doc/refman/5.5/en/innodb-locks-set.html.

      it 'does not assign duplicate perma_ids' do
        perma_ids = Array.new(3) {
          Thread.new do
            revision = create(:revision)
            TestRevisionComponent.create(revision: revision)
          end
        }.map(&:join).map(&:value).map(&:perma_id)

        expect(perma_ids.uniq).to have(3).items
      end

      it 'acquires advisory lock to prevent perma id generation race condition' do
        stub_const('Pageflow::RevisionComponent::ADVISORY_LOCK_TIMEOUT_SECONDS', 0)

        revision = create(:revision)
        component = TestRevisionComponent.new(revision: revision)

        component.during_save_transaction do
          Thread.new {
            other_revision = create(:revision)
            TestRevisionComponent.create(revision: other_revision)
          }.join
        end

        expect {
          component.save
        }.to raise_error(RevisionComponent::PermaIdGenerationAdvisoryLockTimeout)
      end

      it 'does not acquire advisory lock if perma_id is already present' do
        stub_const('Pageflow::RevisionComponent::ADVISORY_LOCK_TIMEOUT_SECONDS', 0)

        revision = create(:revision)
        component = TestRevisionComponent.new(perma_id: 5, revision: revision)

        component.during_save_transaction do
          Thread.new {
            other_revision = create(:revision)
            TestRevisionComponent.create(revision: other_revision)
          }.join
        end

        expect { component.save }.not_to raise_error
      end

      it 'allows nested creates from same thread' do
        stub_const('Pageflow::RevisionComponent::ADVISORY_LOCK_TIMEOUT_SECONDS', 0)
        revision = create(:revision)

        component = TestRevisionComponent.new(revision: revision)

        component.during_save_transaction do
          TestRevisionComponent.create(revision: revision)
        end

        expect { component.save }.not_to raise_error
      end
    end
  end
end
