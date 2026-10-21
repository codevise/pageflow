require 'spec_helper'
require 'pageflow/used_file_test_helper'

module PageflowScrolled
  RSpec.describe ReferencedFiles do
    include UsedFileTestHelper

    it 'includes files referenced by content elements' do
      entry = create(:draft_entry, type_name: 'scrolled')
      image_file = create_used_file(:image_file, entry:)
      section = create(:section, revision: entry.draft)
      create(:content_element,
             section:,
             type_name: 'inlineImage',
             configuration: {'id' => image_file.perma_id})

      referenced_files = referenced_files_for(entry)

      expect(referenced_files.include?('image_files', image_file.perma_id)).to eq(true)
    end

    it 'includes files linked from content elements' do
      entry = create(:draft_entry, type_name: 'scrolled')
      other_file = create_used_file(:image_file, entry:)
      section = create(:section, revision: entry.draft)
      create(:content_element,
             section:,
             type_name: 'textBlock',
             configuration: {
               'value' => [{'type' => 'paragraph', 'children' => [
                 {'type' => 'link',
                  'href' => {'file' => {'permaId' => other_file.perma_id,
                                        'collectionName' => 'imageFiles'}},
                  'children' => [{'text' => 'Download'}]}
               ]}]
             })

      referenced_files = referenced_files_for(entry)

      expect(referenced_files.include?('image_files', other_file.perma_id)).to eq(true)
    end

    it 'includes files referenced by sections' do
      entry = create(:draft_entry, type_name: 'scrolled')
      image_file = create_used_file(:image_file, entry:)
      create(:section,
             revision: entry.draft,
             configuration: {'backdrop' => {'image' => image_file.perma_id}})

      referenced_files = referenced_files_for(entry)

      expect(referenced_files.include?('image_files', image_file.perma_id)).to eq(true)
    end

    it 'includes share image of entry' do
      entry = create(:draft_entry, type_name: 'scrolled')
      image_file = create_used_file(:image_file, entry:)
      entry.draft.update!(share_image_id: image_file.perma_id)

      referenced_files = referenced_files_for(entry)

      expect(referenced_files.include?('image_files', image_file.perma_id)).to eq(true)
    end

    it 'does not include files of other collections with same perma id' do
      entry = create(:draft_entry, type_name: 'scrolled')
      image_file = create_used_file(:image_file, entry:)
      section = create(:section, revision: entry.draft)
      create(:content_element,
             section:,
             type_name: 'inlineImage',
             configuration: {'id' => image_file.perma_id})

      referenced_files = referenced_files_for(entry)

      expect(referenced_files.include?('video_files', image_file.perma_id)).to eq(false)
    end

    it 'does not include files of inactive references' do
      entry = create(:draft_entry, type_name: 'scrolled')
      image_file = create_used_file(:image_file, entry:)
      section = create(:section, revision: entry.draft)
      create(:content_element,
             section:,
             type_name: 'inlineVideo',
             configuration: {'portraitPosterId' => image_file.perma_id})

      referenced_files = referenced_files_for(entry)

      expect(referenced_files.include?('image_files', image_file.perma_id)).to eq(false)
    end

    it 'does not include files only referenced by sections it was not given' do
      entry = create(:draft_entry, type_name: 'scrolled')
      image_file = create_used_file(:image_file, entry:)
      section = create(:section,
                       revision: entry.draft,
                       configuration: {'backdrop' => {'image' => image_file.perma_id}})
      create(:content_element,
             section:,
             type_name: 'inlineImage',
             configuration: {'id' => image_file.perma_id})

      referenced_files = referenced_files_for(entry, sections: [], content_elements: [])

      expect(referenced_files.include?('image_files', image_file.perma_id)).to eq(false)
    end

    it 'includes nested files of referenced files' do
      entry = create(:draft_entry, type_name: 'scrolled')
      video_file = create_used_file(:video_file, entry:)
      text_track_file = create(:text_track_file, used_in: entry.draft, parent_file: video_file)
      section = create(:section, revision: entry.draft)
      create(:content_element,
             section:,
             type_name: 'inlineVideo',
             configuration: {'id' => video_file.perma_id})

      referenced_files = referenced_files_for(entry)

      expect(referenced_files.include?('text_track_files', perma_id_of(entry, text_track_file)))
        .to eq(true)
    end

    it 'does not include nested files of other files' do
      entry = create(:draft_entry, type_name: 'scrolled')
      video_file = create_used_file(:video_file, entry:)
      other_video_file = create_used_file(:video_file, entry:)
      text_track_file = create(:text_track_file,
                               used_in: entry.draft,
                               parent_file: other_video_file)
      section = create(:section, revision: entry.draft)
      create(:content_element,
             section:,
             type_name: 'inlineVideo',
             configuration: {'id' => video_file.perma_id})

      referenced_files = referenced_files_for(entry)

      expect(referenced_files.include?('text_track_files', perma_id_of(entry, text_track_file)))
        .to eq(false)
    end

    def referenced_files_for(entry,
                             sections: Section.all_for_revision(entry.draft),
                             content_elements: ContentElement.all_for_revision(entry.draft))
      ReferencedFiles.new(
        entry,
        sections:,
        content_elements:,
        locations: EntryFileReferenceLocations.new(Pageflow.config_for(entry))
      )
    end

    def perma_id_of(entry, file)
      entry.draft.find_file(file.class, file.id).perma_id
    end
  end
end
