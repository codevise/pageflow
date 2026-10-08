require 'spec_helper'
require 'pageflow/used_file_test_helper'

module PageflowScrolled
  RSpec.describe SectionsCopy do
    include UsedFileTestHelper

    it 'copies sections into chapter of other entry' do
      source_entry = create(:draft_entry, type_name: 'scrolled')
      destination_entry = create(:draft_entry, type_name: 'scrolled')
      source_chapter = create(:scrolled_chapter, revision: source_entry.draft)
      create(:section, chapter: source_chapter, position: 0, configuration: {'layout' => 'left'})
      create(:section, chapter: source_chapter, position: 1, configuration: {'layout' => 'right'})
      destination_chapter = create(:scrolled_chapter, revision: destination_entry.draft)

      sections = SectionsCopy
                 .new(source_entry:, destination_entry:)
                 .perform(source_chapter.sections, chapter: destination_chapter)

      expect(sections.map { |section| section.configuration['layout'] }).to eq(%w[left right])
      expect(destination_chapter.sections.reload).to eq(sections)
    end

    it 'copies content elements of sections' do
      source_entry = create(:draft_entry, type_name: 'scrolled')
      destination_entry = create(:draft_entry, type_name: 'scrolled')
      source_section = create(:section, revision: source_entry.draft)
      create(:content_element, :heading, section: source_section, position: 0)
      create(:content_element, :text_block, section: source_section, position: 1)
      destination_chapter = create(:scrolled_chapter, revision: destination_entry.draft)

      sections = SectionsCopy
                 .new(source_entry:, destination_entry:)
                 .perform([source_section], chapter: destination_chapter)

      expect(sections.first.content_elements.map(&:type_name)).to eq(%w[heading textBlock])
    end

    it 'appends sections after existing sections of destination chapter' do
      source_entry = create(:draft_entry, type_name: 'scrolled')
      destination_entry = create(:draft_entry, type_name: 'scrolled')
      source_section = create(:section, revision: source_entry.draft)
      destination_chapter = create(:scrolled_chapter, revision: destination_entry.draft)
      existing_section = create(:section, chapter: destination_chapter, position: 0)

      sections = SectionsCopy
                 .new(source_entry:, destination_entry:)
                 .perform([source_section], chapter: destination_chapter)

      expect(destination_chapter.sections.reload).to eq([existing_section, sections.first])
      expect(sections.first.position).to eq(1)
    end

    it 'assigns perma ids from destination entry' do
      source_entry = create(:draft_entry, type_name: 'scrolled')
      destination_entry = create(:draft_entry, type_name: 'scrolled')
      source_section = create(:section, revision: source_entry.draft)
      create(:content_element, :heading, section: source_section)
      destination_chapter = create(:scrolled_chapter, revision: destination_entry.draft)
      create(:section, chapter: destination_chapter)
      counter_before = destination_entry.entry.reload.perma_id_counter

      sections = SectionsCopy
                 .new(source_entry:, destination_entry:)
                 .perform([source_section], chapter: destination_chapter)

      perma_ids = [sections.first.perma_id, *sections.first.content_elements.map(&:perma_id)]

      expect(perma_ids).to all(be > counter_before)
      expect(destination_entry.entry.reload.perma_id_counter).to eq(perma_ids.max)
    end

    describe 'referenced files' do
      it 'uses file referenced by section in destination entry' do
        source_entry = create(:draft_entry, type_name: 'scrolled')
        destination_entry = create(:draft_entry, type_name: 'scrolled')
        image_file = create_used_file(:image_file, entry: source_entry)
        source_section = create(:section,
                                revision: source_entry.draft,
                                configuration: {'backdrop' => {'image' => image_file.perma_id}})
        destination_chapter = create(:scrolled_chapter, revision: destination_entry.draft)

        SectionsCopy
          .new(source_entry:, destination_entry:)
          .perform([source_section], chapter: destination_chapter)

        expect(destination_entry.draft.image_files).to eq([image_file.to_model])
      end

      it 'rewrites perma id of file referenced by section' do
        source_entry = create(:draft_entry, type_name: 'scrolled')
        destination_entry = create(:draft_entry, type_name: 'scrolled')
        create_list(:image_file, 2, used_in: destination_entry.draft)
        image_file = create_used_file(:image_file, entry: source_entry)
        source_section = create(:section,
                                revision: source_entry.draft,
                                configuration: {'backdrop' => {'image' => image_file.perma_id}})
        destination_chapter = create(:scrolled_chapter, revision: destination_entry.draft)

        sections = SectionsCopy
                   .new(source_entry:, destination_entry:)
                   .perform([source_section], chapter: destination_chapter)

        expect(sections.first.configuration['backdrop']['image'])
          .to eq(destination_entry.draft.find_file(Pageflow::ImageFile, image_file.id).perma_id)
      end

      it 'rewrites perma id of file referenced by content element' do
        source_entry = create(:draft_entry, type_name: 'scrolled')
        destination_entry = create(:draft_entry, type_name: 'scrolled')
        create_list(:image_file, 2, used_in: destination_entry.draft)
        image_file = create_used_file(:image_file, entry: source_entry)
        source_section = create(:section, revision: source_entry.draft, configuration: {})
        create(:content_element,
               section: source_section,
               type_name: 'inlineImage',
               configuration: {'id' => image_file.perma_id})
        destination_chapter = create(:scrolled_chapter, revision: destination_entry.draft)

        sections = SectionsCopy
                   .new(source_entry:, destination_entry:)
                   .perform([source_section], chapter: destination_chapter)

        expect(sections.first.content_elements.first.configuration['id'])
          .to eq(destination_entry.draft.find_file(Pageflow::ImageFile, image_file.id).perma_id)
      end

      it 'reuses file usage the destination entry already has' do
        source_entry = create(:draft_entry, type_name: 'scrolled')
        destination_entry = create(:draft_entry, type_name: 'scrolled')
        image_file = create_used_file(:image_file, entry: source_entry)
        existing_usage = create(:file_usage, file: image_file, revision: destination_entry.draft)
        source_section = create(:section,
                                revision: source_entry.draft,
                                configuration: {'backdrop' => {'image' => image_file.perma_id}})
        destination_chapter = create(:scrolled_chapter, revision: destination_entry.draft)

        sections = SectionsCopy
                   .new(source_entry:, destination_entry:)
                   .perform([source_section], chapter: destination_chapter)

        expect(destination_entry.draft.file_usages.where(file: image_file).count).to eq(1)
        expect(sections.first.configuration['backdrop']['image'])
          .to eq(existing_usage.file_perma_id)
      end

      it 'uses nested files of referenced file in destination entry' do
        source_entry = create(:draft_entry, type_name: 'scrolled')
        destination_entry = create(:draft_entry, type_name: 'scrolled')
        video_file = create_used_file(:video_file, entry: source_entry)
        text_track_file = create(:text_track_file,
                                 used_in: source_entry.draft,
                                 parent_file: video_file)
        source_section = create(:section,
                                revision: source_entry.draft,
                                configuration: {'backdrop' => {'video' => video_file.perma_id}})
        destination_chapter = create(:scrolled_chapter, revision: destination_entry.draft)

        SectionsCopy
          .new(source_entry:, destination_entry:)
          .perform([source_section], chapter: destination_chapter)

        expect(destination_entry.draft.find_files(Pageflow::TextTrackFile).map(&:id))
          .to eq([text_track_file.id])
      end

      it 'does not use nested files of other files' do
        source_entry = create(:draft_entry, type_name: 'scrolled')
        destination_entry = create(:draft_entry, type_name: 'scrolled')
        video_file = create_used_file(:video_file, entry: source_entry)
        other_video_file = create(:video_file, used_in: source_entry.draft)
        create(:text_track_file, used_in: source_entry.draft, parent_file: other_video_file)
        source_section = create(:section,
                                revision: source_entry.draft,
                                configuration: {'backdrop' => {'video' => video_file.perma_id}})
        destination_chapter = create(:scrolled_chapter, revision: destination_entry.draft)

        SectionsCopy
          .new(source_entry:, destination_entry:)
          .perform([source_section], chapter: destination_chapter)

        expect(destination_entry.draft.find_files(Pageflow::TextTrackFile)).to be_empty
      end

      it 'leaves value alone when no file is found' do
        source_entry = create(:draft_entry, type_name: 'scrolled')
        destination_entry = create(:draft_entry, type_name: 'scrolled')
        source_section = create(:section,
                                revision: source_entry.draft,
                                configuration: {'backdrop' => {'image' => 'darkPattern'}})
        destination_chapter = create(:scrolled_chapter, revision: destination_entry.draft)

        sections = SectionsCopy
                   .new(source_entry:, destination_entry:)
                   .perform([source_section], chapter: destination_chapter)

        expect(sections.first.configuration['backdrop']['image']).to eq('darkPattern')
        expect(destination_entry.draft.file_usages).to be_empty
      end
    end
  end
end
