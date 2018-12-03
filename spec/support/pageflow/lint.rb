require 'pageflow/global_config_api_test_helper'
require 'pageflow/test_page_type'

module Pageflow
  # Shared examples providing integration level specs for Pageflow
  # components commonly defined by plugins.
  #
  # @since 13.0
  module Lint
    # Ensure file type json partials render correctly.
    #
    # @param name [String] File type name to use in spec descriptions
    # @param create_file_type [#call] Proc creating the file type to test
    # @param create_file [#call] Proc creating a fixture file of the
    #   file type
    #
    # @example
    #
    #   require 'spec_helper'
    #   require 'pageflow/lint'
    #
    #   module SomePlugin
    #     Pageflow::Lint.file_type('some file type',
    #                              create_file_type: -> { SomePlugin.file_type },
    #                              create_file: -> { create(:some_file) })
    #   end
    def self.file_type(name, create_file_type:, create_file:)
      GlobalConfigApiTestHelper.setup

      RSpec.describe "file type #{name}", type: :helper do
        let(:file_type, &create_file_type)

        let(:file, &create_file)

        before do
          pageflow_configure do |config|
            page_type = TestPageType.new(name: :test,
                                         file_types: [file_type])
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
      end
    end
  end
end
