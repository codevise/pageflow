require 'pageflow/global_config_api_test_helper'
require 'pageflow/test_page_type'
require 'pageflow/entry_export_import'

module Pageflow
  module Lint
    # @api private
    module FileType
      def self.lint(name,
                    create_file_type:,
                    create_file:,
                    create_prerequisite_file_types: -> { [] },
                    get_prerequisite_files: ->(_file) { [] })
        GlobalConfigApiTestHelper.setup

        RSpec.describe "file type #{name}", type: :helper do
          let(:file_type, &create_file_type)

          let(:file, &create_file)

          let(:prerequisite_file_types, &create_prerequisite_file_types)

          before do
            pageflow_configure do |config|
              page_type = TestPageType.new(name: 'test',
                                           file_types: [
                                             *prerequisite_file_types,
                                             file_type
                                           ])
              config.page_types.clear
              config.page_types.register(page_type)
            end
          end

          it 'renders seed json without error' do
            expect {
              helper.extend(FilesHelper)
              helper.render(partial: 'pageflow/files/file',
                            formats: [:json],
                            locals: {
                              file: UsedFile.new(file, FileUsage.new),
                              file_type: file_type
                            })
            }.not_to raise_error
          end

          it 'renders editor json without error' do
            helper.extend(FilesHelper)
            helper.extend(Editor::FilesHelper)
            helper.render(partial: 'pageflow/editor/files/file',
                          formats: [:json],
                          locals: {
                            file: UsedFile.new(file, FileUsage.new),
                            file_type: file_type
                          })
          end

          it 'provides css_background_image_urls that returns hash if present' do
            if file_type.css_background_image_urls
              result = file_type.css_background_image_urls.call(file)

              expect(result).to be_a(Hash)
            end
          end

          it 'can be exported and imported without error' do
            exported_entry = create(:entry)
            create(:file_usage, file: file, revision: exported_entry.draft)
            user = create(:user, :manager, on: create(:account))

            get_prerequisite_files.call(file).each do |prerequisite_file|
              create(:file_usage, file: prerequisite_file, revision: exported_entry.draft)
            end

            Dir.mktmpdir do |dir|
              archive_file_path = File.join(dir, 'export.zip')
              EntryExportImport.export(exported_entry, archive_file_path)
              imported_entry = EntryExportImport.import(archive_file_path, creator: user)

              expect(imported_entry.draft.find_files(file_type.model)).to be_present
            end
          end
        end
      end
    end
  end
end
