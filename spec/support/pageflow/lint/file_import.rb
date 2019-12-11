require 'pageflow/global_config_api_test_helper'
require 'pageflow/test_page_type'
require 'pageflow/entry_export_import'

module Pageflow
  module Lint
    # @api private
    module FileImport
      def self.lint(file_importer)
        GlobalConfigApiTestHelper.setup
        RSpec.describe "file importer #{file_importer.name}" do
          before do
            pageflow_configure do |config|
              config.file_importers.register(file_importer)
            end
          end

          def file_importer_credentials(authentication_provider)
            token = AuthenticationToken.where(provider: authentication_provider) if
              authentication_provider.present?
            unless token.nil?
              token = nil if token.empty?
            end
            token
          end

          it 'extends Pageflow::FileImporter class' do
            expect(file_importer).to be_kind_of(Pageflow::FileImporter)
          end

          it 'has a name method which returns string name' do
            expect(file_importer.class.method_defined?(:name)).to be(true)
            expect {
              importer_name = file_importer.name
              expect(importer_name).to be_instance_of(String)
            }.not_to raise_error
          end

          it 'has a logo_source method which returns string source' do
            expect(file_importer.class.method_defined?(:logo_source)).to be(true)
            expect {
              source = file_importer.logo_source
              expect(source).to be_instance_of(String)
            }.not_to raise_error
          end

          it 'has a authentication_provider method' do
            expect(file_importer.class.method_defined?(:authentication_provider)).to be(true)
            provider = file_importer.authentication_provider
            expect(provider).to be_nil.or be_a(Symbol)
          end

          it 'has a search method', :vcr do
            expect(file_importer.class.method_defined?(:search)).to be(true)
            expect {
              provider = file_importer.authentication_provider
              search_result = file_importer.search(file_importer_credentials(provider),
                                                   'test*$*page=1&per_page=15*$*')
              expect(search_result).not_to be_nil
            }.not_to raise_error
          end

          it 'has a files_meta_data method' do
            expect(file_importer.class.method_defined?(:files_meta_data)).to be(true)
            expect {
              provider = file_importer.authentication_provider
              meta_data = file_importer.files_meta_data(file_importer_credentials(provider), {})
              expect(meta_data).not_to be_nil
              expect(meta_data).to include(:collection)
              expect(meta_data).to include(:files)
              expect(meta_data[:files]).to be_kind_of(Array)
            }.not_to raise_error
          end

          it 'has a download_file method' do
            expect(file_importer.class.method_defined?(:download_file)).to be(true)
          end
        end
      end
    end
  end
end
