require 'spec_helper'

module Pageflow
  describe EntryTypes do
    describe '#find_by_name!' do
      it 'returns entry type with given name' do
        entry_types = EntryTypes.new
        entry_type = EntryType.new(name: 'test',
                                   frontend_app: -> {})

        entry_types.register(entry_type)
        result = entry_types.find_by_name!('test')

        expect(result).to be(entry_type)
      end

      it 'raises helpful error if entry type is not found' do
        entry_types = EntryTypes.new

        expect {
          entry_types.find_by_name!('not_there')
        }.to raise_error(/Unknown entry type/)
      end
    end
  end
end
