require 'spec_helper'

module Pageflow
  module EntryExportImport
    describe ZipArchive do
      it 'creates a zip file it does not exist' do
        Dir.mktmpdir do |dir|
          archive_file_name = File.join(dir, 'archive.zip')
          archive = ZipArchive.new(archive_file_name)

          archive.add('some/dir/file', StringIO.new('Some contents'))
          archive.close

          expect(Pathname.new(archive_file_name)).to exist
        end
      end

      it 'supports extracting files to tempfiles' do
        Dir.mktmpdir do |dir|
          archive_file_name = File.join(dir, 'archive.zip')
          archive = ZipArchive.new(archive_file_name)

          archive.add('some/dir/file', StringIO.new('Some contents'))
          archive.close

          archive = ZipArchive.new(archive_file_name)
          result = archive.extract_to_tempfile('some/dir/file') do |file|
            expect(file).to be_a(Tempfile)
            file.read
          end

          expect(result).to eq('Some contents')
        end
      end

      it 'supports overwriting entries' do
        Dir.mktmpdir do |dir|
          archive_file_name = File.join(dir, 'archive.zip')
          archive = ZipArchive.new(archive_file_name)

          archive.add('some/dir/file', StringIO.new('Some contents'))
          archive.add('some/dir/file', StringIO.new('New contents'))
          result = archive.extract_to_tempfile('some/dir/file', &:read)

          expect(result).to eq('New contents')
        end
      end

      it 'supports globbing for paths' do
        Dir.mktmpdir do |dir|
          archive_file_name = File.join(dir, 'archive.zip')
          archive = ZipArchive.new(archive_file_name)

          archive.add('some/1/file', StringIO.new('File 1'))
          archive.add('some/2/file', StringIO.new('File 2'))
          archive.add('other/1/file', StringIO.new('File 2'))
          archive.close

          archive = ZipArchive.new(archive_file_name)

          paths = archive.glob('some/*/*')

          expect(paths).to eq(%w[some/1/file some/2/file])
        end
      end

      it 'can check if entry exists' do
        Dir.mktmpdir do |dir|
          archive_file_name = File.join(dir, 'archive.zip')
          archive = ZipArchive.new(archive_file_name)

          archive.add('some/1/file', StringIO.new('File 1'))
          expect(archive).to include('some/1/file')
          expect(archive).not_to include('not/there/file')
        end
      end

      it 'can handle UTF8 character is file paths' do
        Dir.mktmpdir do |dir|
          archive_file_name = File.join(dir, 'archive.zip')
          archive = ZipArchive.new(archive_file_name)

          archive.add('öäü/1/file', StringIO.new('File 1'))
          archive.close
          archive = ZipArchive.new(archive_file_name)

          expect(archive).to include('öäü/1/file')
        end
      end
    end
  end
end
