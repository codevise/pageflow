require 'fileutils'

namespace :pageflow do
  namespace :entries do
    desc 'Export a single entry specified by its ID.'
    task :export, [:entry_id] => :environment do |_t, args|
      current_timestamp = Time.now.strftime('%Y%m%d%H%M%S')
      entry = Pageflow::Entry.includes(:draft, :published_revision).find(args[:entry_id])
      archive_file_name = Rails.root.join(
        "tmp/entries_export_#{current_timestamp}/entry_#{entry.id}.zip"
      )

      FileUtils.mkdir_p(File.dirname(archive_file_name))
      Pageflow::EntryExportImport.export(entry, archive_file_name)
    end

    desc 'Import entries from file containing one or multiple lines of JSON describing an entry.'
    task :import, [:archive_file_path, :user_id] => :environment do |_t, args|
      archive_file_path = args[:archive_file_path]
      raise 'Could not find JSON file for import' unless File.exist?(archive_file_path)

      user = User.find(args[:user_id])

      Pageflow::EntryExportImport.import(archive_file_path, creator: user)
    end
  end
end
