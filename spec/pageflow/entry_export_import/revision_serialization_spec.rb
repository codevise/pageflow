require 'spec_helper'

module Pageflow
  module EntryExportImport
    describe RevisionSerialization do
      it 'adds revision to passed entry' do
        exported_revision = create(:revision)
        import_entry = create(:entry)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: import_entry,
                                                         creator: create(:user))

        expect(imported_revision.entry).to eq(import_entry)
      end

      it 'sets passed user as creator' do
        exported_revision = create(:revision)
        user = create(:user)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: user)

        expect(imported_revision.creator).to eq(user)
      end

      it 'preserves revision attributes' do
        exported_revision = create(:revision,
                                   :published,
                                   :with_meta_data,
                                   title: 'Some title',
                                   locale: 'en',
                                   share_providers: {
                                     'email' => true
                                   },
                                   created_at: 2.month.ago,
                                   updated_at: 1.month.ago,
                                   configuration: {
                                     grimme_award: true
                                   })

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(imported_revision)
          .to have_attributes(exported_revision.attributes.except('id',
                                                                  'creator_id',
                                                                  'entry_id',
                                                                  'published_until',
                                                                  'updated_at'))
      end

      it 'depublishes published revision' do
        exported_revision = create(:revision, :published)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(imported_revision).not_to be_published
      end

      it 'resets theme_name to default if theme not present in config for entry' do
        pageflow_configure do |config|
          config.features.register('private_theme') do |f|
            f.themes.register('private_theme')
          end
        end

        exported_entry = create(:entry, with_feature: 'private_theme')
        exported_revision = create(:revision,
                                   entry: exported_entry,
                                   theme_name: 'private_theme')

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(imported_revision.theme_name).to eq('default')
      end

      it 'preserves theme_name if theme present in config for entry' do
        pageflow_configure do |config|
          config.features.register('private_theme') do |f|
            f.themes.register('private_theme')
          end
        end

        exported_entry = create(:entry, with_feature: 'private_theme')
        exported_revision = create(:revision,
                                   entry: exported_entry,
                                   theme_name: 'private_theme')
        import_entry = create(:entry, with_feature: 'private_theme')

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: import_entry,
                                                         creator: create(:user))

        expect(imported_revision.theme_name).to eq('private_theme')
      end

      it 'preserves storyline/chapter/page structure' do
        exported_revision = create(:revision)
        storyline1 = create(:storyline, revision: exported_revision)
        storyline2 = create(:storyline, revision: exported_revision)
        chapter1 = create(:chapter, storyline: storyline1)
        chapter2 = create(:chapter, storyline: storyline2)
        chapter3 = create(:chapter, storyline: storyline2)
        create(:page, chapter: chapter1)
        create(:page, chapter: chapter1)
        create(:page, chapter: chapter2)
        create(:page, chapter: chapter3)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(imported_revision).to have(2).storylines
        expect(imported_revision.storylines.first).to have(1).chapter
        expect(imported_revision.storylines.second).to have(2).chapters
        expect(imported_revision.chapters.second).to have(1).page
        expect(imported_revision.chapters.third).to have(1).page
      end

      it 'preserves storyline attributes' do
        exported_revision = create(:revision)
        exported_storyline = create(:storyline,
                                    revision: exported_revision,
                                    configuration: {'some': 'value'},
                                    created_at: 2.month.ago,
                                    updated_at: 1.month.ago)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(imported_revision.storylines.first)
          .to have_attributes(exported_storyline.attributes.except('id',
                                                                   'revision_id',
                                                                   'updated_at'))
      end

      it 'preserves chapter attributes' do
        exported_revision = create(:revision)
        storyline = create(:storyline, revision: exported_revision)
        exported_chapter = create(:chapter,
                                  storyline:,
                                  configuration: {'some' => 'value'},
                                  created_at: 2.month.ago,
                                  updated_at: 1.month.ago)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(imported_revision.chapters.first)
          .to have_attributes(exported_chapter.attributes.except('id',
                                                                 'storyline_id',
                                                                 'updated_at'))
      end

      it 'preserves page attributes' do
        exported_revision = create(:revision)
        storyline = create(:storyline, revision: exported_revision)
        chapter = create(:chapter, storyline:)
        exported_page = create(:page,
                               chapter:,
                               configuration: {'some' => 'value'},
                               created_at: 2.month.ago,
                               updated_at: 1.month.ago)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(imported_revision.pages.first)
          .to have_attributes(exported_page.attributes.except('id',
                                                              'chapter_id',
                                                              'updated_at'))
      end

      it 'preserves widgets' do
        exported_revision = create(:revision)
        exported_widget = create(:widget,
                                 subject: exported_revision,
                                 configuration: {'some' => 'value'},
                                 created_at: 2.month.ago,
                                 updated_at: 1.month.ago)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(imported_revision.widgets.first)
          .to have_attributes(exported_widget.attributes.except('id',
                                                                'subject_id',
                                                                'updated_at'))
      end

      it 'preserves revision components' do
        pageflow_configure do |config|
          config.revision_components.register(TestRevisionComponent)
        end

        exported_revision = create(:revision)
        exported_revision_component = create(:test_revision_component,
                                             revision: exported_revision,
                                             created_at: 2.month.ago,
                                             updated_at: 1.month.ago)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(TestRevisionComponent.all_for_revision(imported_revision).first)
          .to have_attributes(exported_revision_component.attributes.except('id',
                                                                            'revision_id',
                                                                            'updated_at'))
      end

      it 'preserves nested revision components' do
        pageflow_configure do |config|
          config.revision_components.register(TestCompositeRevisionComponent)
        end

        exported_revision = create(:revision)
        exported_revision_component = create(:test_composite_revision_component,
                                             revision: exported_revision)
        nested_revision_component = exported_revision_component.items.create!(text: 'nested')
        deeply_nested_revision_component = nested_revision_component.items.create!(text: 'deep')

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))
        imported_revision_component =
          TestCompositeRevisionComponent.all_for_revision(imported_revision).first

        expect(imported_revision_component).to be_present
        expect(imported_revision_component.items.first).to be_present
        expect(imported_revision_component.items.first.items.first).to be_present
        expect(imported_revision_component)
          .to have_attributes(exported_revision_component.attributes.except('id',
                                                                            'revision_id',
                                                                            'updated_at'))
        expect(imported_revision_component.items.first)
          .to have_attributes(nested_revision_component.attributes.except('id',
                                                                          'parent_id',
                                                                          'updated_at'))
        expect(imported_revision_component.items.first.items.first)
          .to have_attributes(deeply_nested_revision_component.attributes.except('id',
                                                                                 'parent_id',
                                                                                 'updated_at'))
      end

      it 'preserves files and file usages' do
        exported_revision = create(:revision)
        exported_file = create(:image_file,
                               :uploaded,
                               rights: 'some author',
                               created_at: 2.month.ago,
                               updated_at: 1.month.ago)
        exported_file_usage = create(:file_usage,
                                     file: exported_file,
                                     revision: exported_revision,
                                     configuration: {'some' => 'value'})

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(imported_revision.image_files.first)
          .to have_attributes(exported_file.attributes.except('id',
                                                              'entry_id',
                                                              'uploader_id',
                                                              'state',
                                                              'updated_at',
                                                              'output_presences'))
        expect(imported_revision.file_usages.first)
          .to have_attributes(exported_file_usage.attributes.except('id',
                                                                    'file_id',
                                                                    'revision_id',
                                                                    'updated_at'))
      end

      it 'sets confirmed_by and uploader of created file to passed user' do
        exported_revision = create(:revision)
        exported_file = create(:audio_file,
                               uploader: create(:user),
                               confirmed_by: create(:user))
        create(:file_usage, file: exported_file, revision: exported_revision)
        user = create(:user)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: user)

        expect(imported_revision.audio_files.first)
          .to have_attributes(uploader: user,
                              confirmed_by: user)
      end

      it 'sets of entry created file to passed entry' do
        exported_revision = create(:revision)
        exported_file = create(:image_file)
        create(:file_usage, file: exported_file, revision: exported_revision)
        import_entry = create(:entry)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: import_entry,
                                                         creator: create(:user))

        expect(imported_revision.image_files.first.entry).to eq(import_entry)
      end

      it 'reuses files based on passed id mapping' do
        exported_revision = create(:revision)
        exported_file = create(:image_file)
        create(:file_usage, file: exported_file, revision: exported_revision)
        user = create(:user)
        file_mappings = FileMappings.new

        data = RevisionSerialization.dump(exported_revision)
        previously_imported_revision = RevisionSerialization.import(data.deep_dup,
                                                                    entry: create(:entry),
                                                                    creator: user,
                                                                    file_mappings:)

        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: user,
                                                         file_mappings:)

        expect(imported_revision.image_files.first)
          .to eq(previously_imported_revision.image_files.first)
      end

      it 'rewrites parent file foreign keys' do
        exported_revision = create(:revision)
        exported_file = create(:audio_file, used_in: exported_revision)
        create(:text_track_file, parent_file: exported_file, used_in: exported_revision)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(imported_revision.find_files(TextTrackFile).first.parent_file)
          .to eq(imported_revision.audio_files.first)
      end

      it 'preserves registered custom attributes' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                custom_attributes: [:custom])
        end

        exported_revision = create(:revision)
        create(:uploadable_file,
               custom: 'value',
               used_in: exported_revision)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(imported_revision.find_files(TestUploadableFile).first.custom).to eq('value')
      end

      it 'does not preserve unregistered custom attributes' do
        pageflow_configure do |config|
          TestFileType.register(config)
        end

        exported_revision = create(:revision)
        create(:uploadable_file,
               custom: 'not imported value',
               used_in: exported_revision)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(imported_revision.find_files(TestUploadableFile).first.custom).to be_nil
      end

      it 'rewrites custom file type foreign keys' do
        pageflow_configure do |config|
          TestFileType.register(config,
                                custom_attributes: {
                                  related_image_file_id: {
                                    model: 'Pageflow::ImageFile'
                                  }
                                })
        end

        exported_revision = create(:revision)
        exported_image_file = create(:image_file, used_in: exported_revision)
        create(:uploadable_file,
               related_image_file: exported_image_file,
               used_in: exported_revision)

        data = RevisionSerialization.dump(exported_revision)
        imported_revision = RevisionSerialization.import(data,
                                                         entry: create(:entry),
                                                         creator: create(:user))

        expect(imported_revision.find_files(TestUploadableFile).first.related_image_file)
          .to eq(imported_revision.image_files.first)
      end
    end
  end
end
