require 'fileutils'
require 'directory_zip_file_generator'

namespace :pageflow do
  namespace :entries do
    desc 'Export a single entry specified by its ID.'
    task :export, [:entry_id] => :environment do |t, args|
      current_timestamp = Time.now.strftime("%Y%m%d%H%M%S")
      entry = Pageflow::Entry.includes(:draft, :published_revision).find(args[:entry_id])
      export_directory = Rails.root.join("tmp/entries_export_#{current_timestamp}/entry_#{entry.id}")
      exporter = Pageflow::EntryExportImport::EntryExporter.new(export_directory)
      exporter.call(entry)
    end

    desc 'Import entries from file containing one or multiple lines of JSON describing an entry.'
    task :import, [:entry_file, :user_id] => :environment do |t, args|
      entry_file = args[:entry_file]
      raise 'Could not find JSON file for import' unless File.exist?(entry_file)

      user = User.find(args[:user_id])
      attachments_path = File.join(File.dirname(entry_file), 'files')
      File.open(entry_file, 'r').each do |json_line|
        importer = Pageflow::EntryExportImport::EntryImporter.new(user, attachments_path)
        importer.call(json_line)
      end
    end
  end
end