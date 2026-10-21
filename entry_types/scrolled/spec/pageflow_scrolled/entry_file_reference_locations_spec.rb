require 'spec_helper'

module PageflowScrolled
  RSpec.describe EntryFileReferenceLocations do
    describe '#content_element_locations' do
      it 'includes locations of all content element types' do
        entry = create(:published_entry, type_name: 'scrolled')
        locations = EntryFileReferenceLocations.new(Pageflow.config_for(entry))

        expect(locations.content_element_locations)
          .to include('inlineImage' => include('path' => ['id'], 'collection' => 'imageFiles'),
                      'textBlock' => [])
      end
    end

    describe '#content_element_locations_for' do
      it 'returns locations of content element type' do
        entry = create(:published_entry, type_name: 'scrolled')
        locations = EntryFileReferenceLocations.new(Pageflow.config_for(entry))

        expect(locations.content_element_locations_for('inlineImage'))
          .to include('path' => ['id'], 'collection' => 'imageFiles')
      end

      it 'returns empty list and logs for content element type without schema' do
        entry = create(:published_entry,
                       type_name: 'scrolled',
                       with_feature: 'file_rights_from_references')
        locations = EntryFileReferenceLocations.new(Pageflow.config_for(entry))

        expect(Rails.logger).to receive(:warn).with(/unknownType/).once

        expect(locations.content_element_locations_for('unknownType')).to eq([])
        expect(locations.content_element_locations_for('unknownType')).to eq([])
      end
    end
  end
end
