require 'spec_helper'
require 'pageflow/used_file_test_helper'

module PageflowScrolled
  RSpec.describe ContentElementsCopy do
    include UsedFileTestHelper

    it 'copies content elements into section of other entry' do
      source_entry = create(:draft_entry, type_name: 'scrolled')
      destination_entry = create(:draft_entry, type_name: 'scrolled')
      source_section = create(:section, revision: source_entry.draft)
      heading = create(:content_element, :heading, section: source_section, position: 0)
      text_block = create(:content_element, :text_block, section: source_section, position: 1)
      destination_section = create(:section, revision: destination_entry.draft)

      content_elements = ContentElementsCopy
                         .new(source_entry:, destination_entry:)
                         .perform([heading, text_block], section: destination_section)

      expect(content_elements.map(&:type_name)).to eq(%w[heading textBlock])
      expect(destination_section.content_elements.reload).to eq(content_elements)
      expect(source_section.content_elements.reload).to eq([heading, text_block])
    end

    it 'appends content elements after existing content elements of section' do
      source_entry = create(:draft_entry, type_name: 'scrolled')
      destination_entry = create(:draft_entry, type_name: 'scrolled')
      heading = create(:content_element, :heading, revision: source_entry.draft)
      destination_section = create(:section, revision: destination_entry.draft)
      existing = create(:content_element, :text_block, section: destination_section, position: 0)

      content_elements = ContentElementsCopy
                         .new(source_entry:, destination_entry:)
                         .perform([heading], section: destination_section)

      expect(destination_section.content_elements.reload)
        .to eq([existing, content_elements.first])
      expect(content_elements.first.position).to eq(1)
    end

    it 'moves backdrop content elements into foreground' do
      source_entry = create(:draft_entry, type_name: 'scrolled')
      destination_entry = create(:draft_entry, type_name: 'scrolled')
      backdrop = create(:content_element,
                        revision: source_entry.draft,
                        type_name: 'inlineImage',
                        configuration: {'position' => 'backdrop', 'caption' => 'Sky'})
      destination_section = create(:section, revision: destination_entry.draft)

      content_elements = ContentElementsCopy
                         .new(source_entry:, destination_entry:)
                         .perform([backdrop], section: destination_section)

      expect(content_elements.first.configuration).to eq('caption' => 'Sky')
    end

    it 'assigns perma ids from destination entry' do
      source_entry = create(:draft_entry, type_name: 'scrolled')
      destination_entry = create(:draft_entry, type_name: 'scrolled')
      heading = create(:content_element, :heading, revision: source_entry.draft)
      destination_section = create(:section, revision: destination_entry.draft)
      counter_before = destination_entry.entry.reload.perma_id_counter

      content_elements = ContentElementsCopy
                         .new(source_entry:, destination_entry:)
                         .perform([heading], section: destination_section)

      expect(content_elements.first.perma_id).to be > counter_before
    end

    it 'rewrites perma id of file referenced by content element' do
      source_entry = create(:draft_entry, type_name: 'scrolled')
      destination_entry = create(:draft_entry, type_name: 'scrolled')
      create_list(:image_file, 2, used_in: destination_entry.draft)
      image_file = create_used_file(:image_file, entry: source_entry)
      inline_image = create(:content_element,
                            revision: source_entry.draft,
                            type_name: 'inlineImage',
                            configuration: {'id' => image_file.perma_id})
      destination_section = create(:section, revision: destination_entry.draft)

      content_elements = ContentElementsCopy
                         .new(source_entry:, destination_entry:)
                         .perform([inline_image], section: destination_section)

      expect(content_elements.first.configuration['id'])
        .to eq(destination_entry.draft.find_file(Pageflow::ImageFile, image_file.id).perma_id)
    end
  end
end
