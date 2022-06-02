require 'spec_helper'
require 'pageflow/shared_contexts/fake_translations'

module Pageflow
  module Admin
    describe EntriesHelper do
      describe '#entry_type_collection' do
        include_context 'fake translations'

        it 'returns collection items' do
          translation(I18n.locale,
                      'activerecord.values.pageflow/entry.type_names.phaged',
                      'Test Type')

          pageflow_configure do |config|
            config.entry_types.register(TestEntryType.new(name: 'phaged'))
          end

          result = helper.entry_type_collection

          expect(result).to include('Test Type' => 'phaged')
        end

        it 'supports passing in entry types' do
          translation(I18n.locale,
                      'activerecord.values.pageflow/entry.type_names.phaged',
                      'Test Type')

          result = helper.entry_type_collection([TestEntryType.new(name: 'phaged')])

          expect(result).to include('Test Type' => 'phaged')
        end
      end
    end
  end
end
