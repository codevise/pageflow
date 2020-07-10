require 'pageflow/global_config_api_test_helper'

module Pageflow
  module Lint
    # @api private
    module EntryType
      def self.lint(entry_type)
        RSpec.describe "entry type #{entry_type.name}" do
          let(:entry_type) { entry_type }

          describe '#editor_fragment_renderer' do
            it 'renders head fragment without error' do
              entry = DraftEntry.new(
                FactoryBot.create(
                  :entry,
                  type_name: entry_type.name
                )
              )

              expect {
                entry_type.editor_fragment_renderer.head_fragment(entry)
              }.not_to raise_error
            end

            it 'renders body fragment without error' do
              entry = DraftEntry.new(
                FactoryBot.create(
                  :entry,
                  type_name: entry_type.name
                )
              )

              expect {
                entry_type.editor_fragment_renderer.body_fragment(entry)
              }.not_to raise_error
            end

            it 'renders seed fragment without error' do
              entry = DraftEntry.new(
                FactoryBot.create(
                  :entry,
                  type_name: entry_type.name
                )
              )

              expect {
                entry_type.editor_fragment_renderer.seed_fragment(entry)
              }.not_to raise_error
            end
          end
        end
      end
    end
  end
end
