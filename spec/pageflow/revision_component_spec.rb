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

    describe '.create_with_lock!' do
      it 'acquires advisory lock to prevent perma id generation race condition',
         multithread: true do
        stub_const('Pageflow::RevisionComponent::ADVISORY_LOCK_TIMEOUT_SECONDS', 0)

        revision = create(:revision)

        expect {
          TestRevisionComponent.create_with_lock!(revision: revision) do
            Thread.new {
              TestRevisionComponent.create_with_lock!(revision: revision)
            }.join
          end
        }.to raise_error(RevisionComponent::PermaIdGenerationAdvisoryLockTimeout)
      end

      it 'allows nested creates from same thread' do
        stub_const('Pageflow::RevisionComponent::ADVISORY_LOCK_TIMEOUT_SECONDS', 0)
        revision = create(:revision)

        expect {
          TestRevisionComponent.create_with_lock!(revision: revision) do
            TestRevisionComponent.create_with_lock!(revision: revision)
          end
        }.not_to raise_error
      end
    end
  end
end
