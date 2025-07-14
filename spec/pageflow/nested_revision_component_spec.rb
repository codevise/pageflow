require 'spec_helper'

module Pageflow
  describe NestedRevisionComponent do
    describe '#duplicate ' do
      it 'returns duplcated record' do
        revision = create(:revision)
        revision_component = TestCompositeRevisionComponent.create!(revision:)
        nested_revision_component = revision_component.items.create!(text: 'nested')

        result = nested_revision_component.duplicate

        expect(result).to be_persisted
        expect(result.parent).to eq(nested_revision_component.parent)
        expect(result.text).to eq(nested_revision_component.text)
      end

      it 'assigns new perma id' do
        revision = create(:revision)
        revision_component = TestCompositeRevisionComponent.create!(revision:)
        nested_revision_component = revision_component.items.create!(text: 'nested')

        result = nested_revision_component.duplicate

        expect(result.perma_id).not_to eq(nested_revision_component.perma_id)
      end

      it 'duplcates deeply nested revision components' do
        revision = create(:revision)
        revision_component = TestCompositeRevisionComponent.create!(revision:)
        nested_revision_component = revision_component.items.create!(text: 'nested')
        nested_revision_component.items.create!(text: 'deep')

        result = nested_revision_component.duplicate

        expect(result.items.first.text).to eq('deep')
      end

      it 'assigns new perma ids for deeply nesed revision component' do
        revision = create(:revision)
        revision_component = TestCompositeRevisionComponent.create!(revision:)
        nested_revision_component = revision_component.items.create!(text: 'nested')
        deeply_nested_component = nested_revision_component.items.create!(text: 'deep')

        result = nested_revision_component.duplicate

        expect(result.items.first.perma_id).not_to eq(deeply_nested_component.perma_id)
      end
    end
  end
end
