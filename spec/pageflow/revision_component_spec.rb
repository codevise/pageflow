require 'spec_helper'

module Pageflow
  describe RevisionComponent do
    it 'touches revision on create' do
      revision = create(:revision)

      expect {
        Timecop.freeze(1.minute.from_now) do
          TestRevisionComponent.create!(revision:)
        end
      }.to(change { revision.reload.updated_at })
    end

    describe '#perma_id' do
      it 'is set on creation' do
        revision = create(:revision)
        revision_component = TestRevisionComponent.create!(revision:)

        expect(revision_component.perma_id).to be_present
      end

      it 'differs for separate RevisonComponents' do
        revision = create(:revision)
        revision_component1 = TestRevisionComponent.create!(revision:)
        revision_component2 = TestRevisionComponent.create!(revision:)

        expect(revision_component1.perma_id).not_to eq(revision_component2.perma_id)
      end
    end

    describe '#copy_to' do
      it 'keeps perma_id' do
        revision = create(:revision)
        revision_component = TestRevisionComponent.create!(revision:)
        other_revision = create(:revision)

        revision_component.copy_to(other_revision)
        revision_component_copy = TestRevisionComponent.all_for_revision(other_revision).first
        expect(revision_component.perma_id).to eq(revision_component_copy.perma_id)
      end

      it 'copies nested revision components' do
        revision = create(:revision)
        revision_component = TestCompositeRevisionComponent.create!(revision:)
        revision_component.items.create!(text: 'nested')
        other_revision = create(:revision)

        revision_component.copy_to(other_revision)
        revision_component_copy =
          TestCompositeRevisionComponent.all_for_revision(other_revision).first

        expect(revision_component_copy.items.first).to be_present
        expect(revision_component_copy.items.first.perma_id)
          .to eq(revision_component.items.first.perma_id)
        expect(revision_component_copy.items.first.text).to eq('nested')
      end

      it 'copies deeply nested revision components' do
        revision = create(:revision)
        revision_component = TestCompositeRevisionComponent.create!(revision:)
        nested_revision_component = revision_component.items.create!
        nested_revision_component.items.create!(text: 'deep')
        other_revision = create(:revision)

        revision_component.copy_to(other_revision)
        revision_component_copy =
          TestCompositeRevisionComponent.all_for_revision(other_revision).first

        expect(revision_component_copy.items.first).to be_present
        expect(revision_component_copy.items.first.items.first).to be_present
        expect(revision_component_copy.items.first.items.first.perma_id)
          .to eq(revision_component.items.first.items.first.perma_id)
        expect(revision_component_copy.items.first.items.first.text)
          .to eq('deep')
      end
    end

    describe '.from_perma_ids' do
      it 'returns list of RevisionComponents' do
        revision = create(:revision)
        revision_component = TestRevisionComponent.create!(revision:)

        components = TestRevisionComponent.from_perma_ids(revision, [revision_component.perma_id])

        expect(components).to eq([revision_component])
      end
    end
  end
end
