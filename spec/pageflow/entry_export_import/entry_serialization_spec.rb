require 'spec_helper'

module Pageflow
  module EntryExportImport
    describe EntrySerialization do
      it 'preserves entry attributes' do
        export_account = create(:account)
        exported_entry = create(:entry,
                                account: export_account,
                                title: 'Some title',
                                folder: create(:folder, account: export_account),
                                features_configuration: {'some_feature' => true},
                                first_published_at: 1.year.ago,
                                edited_at: 3.months.ago,
                                created_at: 2.months.ago,
                                updated_at: 1.month.ago)

        data = EntrySerialization.dump(exported_entry)
        imported_entry = EntrySerialization.import(data,
                                                   account: create(:account),
                                                   creator: create(:user))

        expect(imported_entry)
          .to have_attributes(exported_entry.attributes.except('id',
                                                               'slug',
                                                               'account_id',
                                                               'folder_id',
                                                               'theming_id',
                                                               'updated_at'))
      end

      it 'resets folder' do
        export_account = create(:account)
        exported_entry = create(:entry,
                                account: export_account,
                                folder: create(:folder, account: export_account))

        data = EntrySerialization.dump(exported_entry)
        imported_entry = EntrySerialization.import(data,
                                                   account: create(:account),
                                                   creator: create(:user))

        expect(imported_entry.folder).to be_nil
      end

      it 'uses passed account and its default theming' do
        exported_entry = create(:entry,
                                title: 'Some title',
                                features_configuration: {'some_feature' => true},
                                first_published_at: 1.year.ago,
                                edited_at: 3.months.ago,
                                created_at: 2.months.ago,
                                updated_at: 1.month.ago)
        import_account = create(:account)

        data = EntrySerialization.dump(exported_entry)
        imported_entry = EntrySerialization.import(data,
                                                   account: import_account,
                                                   creator: create(:user))

        expect(imported_entry.account).to eq(import_account)
        expect(imported_entry.theming).to eq(import_account.default_theming)
      end

      it 'does not include host system specific attributes in dump' do
        exported_entry = create(:entry,
                                title: 'Some title',
                                features_configuration: {'some_feature' => true},
                                first_published_at: 1.year.ago,
                                edited_at: 3.months.ago,
                                created_at: 2.months.ago,
                                updated_at: 1.month.ago)

        data = EntrySerialization.dump(exported_entry)

        expect(data['entry']).not_to have_key('password_digest')
        expect(data['entry']).not_to have_key('users_count')
      end

      it 'preserves the draft revision' do
        exported_entry = create(:entry)
        exported_entry.draft.update!(title: 'My draft')

        data = EntrySerialization.dump(exported_entry)
        imported_entry = EntrySerialization.import(data,
                                                   account: create(:account),
                                                   creator: create(:user))

        expect(imported_entry.draft.title).to eq('My draft')
      end

      it 'preserves given published revision in unpublished state' do
        exported_entry = create(:entry,
                                :published,
                                published_revision_attributes: {title: 'My story'})

        data = EntrySerialization.dump(exported_entry, exported_entry.published_revision)
        imported_entry = EntrySerialization.import(data,
                                                   account: create(:account),
                                                   creator: create(:user))

        expect(imported_entry).not_to be_published
        expect(imported_entry.revisions.publications).to have(1).item
        expect(imported_entry.revisions.publications.first.title).to eq('My story')
      end

      it 'reuses files between draft and given published revision' do
        user = create(:user)
        exported_entry = create(:entry)
        create(:image_file, used_in: exported_entry.draft)
        exported_entry.publish(creator: user)

        data = EntrySerialization.dump(exported_entry,
                                       exported_entry.published_revision)
        imported_entry = EntrySerialization.import(data,
                                                   account: create(:account),
                                                   creator: create(:user))

        expect(imported_entry.draft.image_files).to have(1).item
        expect(imported_entry.draft.image_files.first)
          .to eq(imported_entry.revisions.publications.first.image_files.first)
      end

      it 'allows passing FileMappings object' do
        exported_entry = create(:entry)
        exported_image_file = create(:image_file, used_in: exported_entry.draft)

        file_mappings = FileMappings.new
        data = EntrySerialization.dump(exported_entry)
        EntrySerialization.import(data,
                                  account: create(:account),
                                  creator: create(:user),
                                  file_mappings: file_mappings)

        expect(file_mappings.imported_id_for(exported_image_file.class.name,
                                             exported_image_file.id)).to be_positive
      end

      it 'raise error if dumped versions do not match page type versions' do
        Pageflow.config.page_types.register(TestPageType.new(name: 'test',
                                                             export_version: '2.1.0',
                                                             import_version_requirement: '2.2.0'))
        exported_entry = create(:entry)

        data = EntrySerialization.dump(exported_entry)

        expect {
          EntrySerialization.import(data,
                                    account: create(:account),
                                    creator: create(:user))
        }.to raise_error PageTypeVersions::IncompatibleVersionsError
      end
    end
  end
end
