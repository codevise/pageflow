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
