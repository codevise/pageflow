require 'spec_helper'
require 'pageflow/entry_export_import'

module Pageflow
  describe EntryExportImport do
    describe '#export' do
      it 'creates zip archive at given path' do
        Dir.mktmpdir do |dir|
          entry = create(:entry)
          archive_file_path = File.join(dir, 'export.zip')

          EntryExportImport.export(entry, archive_file_path)

          expect(Pathname.new(archive_file_path)).to exist
        end
      end
    end

    describe '#import', perform_jobs: true do
      it 'creates entry' do
        Dir.mktmpdir do |dir|
          entry = create(:entry)
          archive_file_path = File.join(dir, 'export.zip')
          user = create(:user, :manager, on: create(:account))

          EntryExportImport.export(entry, archive_file_path)

          expect {
            EntryExportImport.import(archive_file_path, creator: user)
          }.to(change { user.accounts.first.entries.count })
        end
      end

      it 'preserves published revision' do
        Dir.mktmpdir do |dir|
          exported_entry = create(:entry,
                                  :published,
                                  published_revision_attributes: {title: 'My story'})
          archive_file_path = File.join(dir, 'export.zip')
          user = create(:user, :manager, on: create(:account))

          EntryExportImport.export(exported_entry, archive_file_path)
          imported_entry = EntryExportImport.import(archive_file_path, creator: user)

          expect(imported_entry.revisions.publications).to have(1).item
          expect(imported_entry.revisions.publications.first.title).to eq('My story')
        end
      end

      it 'preserves last previously published revision' do
        Dir.mktmpdir do |dir|
          user = create(:user, :manager, on: create(:account))
          exported_entry = create(:entry)
          exported_entry.draft.update(title: 'Version 1')
          exported_entry.publish(creator: user)
          Timecop.freeze(1.day.from_now)
          exported_entry.draft.update(title: 'Version 2')
          exported_entry.publish(creator: user, published_until: 1.day.from_now)
          Timecop.freeze(1.week.from_now)
          archive_file_path = File.join(dir, 'export.zip')

          expect(exported_entry).not_to be_published

          EntryExportImport.export(exported_entry, archive_file_path)
          imported_entry = EntryExportImport.import(archive_file_path, creator: user)

          expect(imported_entry.revisions.publications).to have(1).item
          expect(imported_entry.revisions.publications.first.title).to eq('Version 2')
        end
      end

      it 'restores attachment files in draft' do
        Dir.mktmpdir do |dir|
          exported_entry = create(:entry)
          create(:image_file, used_in: exported_entry.draft)
          archive_file_path = File.join(dir, 'export.zip')
          user = create(:user, :manager, on: create(:account))

          EntryExportImport.export(exported_entry, archive_file_path)
          imported_entry = EntryExportImport.import(archive_file_path, creator: user)

          expect(imported_entry.draft.image_files.first.attachment.exists?).to eq(true)
        end
      end

      it 'restores attachment files in published revision' do
        Dir.mktmpdir do |dir|
          exported_entry = create(:entry, :published)
          create(:image_file, used_in: exported_entry.published_revision)
          archive_file_path = File.join(dir, 'export.zip')
          user = create(:user, :manager, on: create(:account))

          EntryExportImport.export(exported_entry, archive_file_path)
          imported_entry = EntryExportImport.import(archive_file_path, creator: user)

          last_publication = imported_entry.revisions.publications.first
          expect(last_publication.image_files.first.attachment.exists?).to eq(true)
        end
      end
    end
  end
end
