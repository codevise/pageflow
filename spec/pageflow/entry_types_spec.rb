require 'spec_helper'

module Pageflow
  describe EntryTypes do
    it 'is enumarable' do
      entry_types = EntryTypes.new
      entry_type = TestEntryType.new(name: 'test')

      entry_types.register(entry_type)
      result = entry_types.map(&:name)

      expect(result).to eq(['test'])
    end

    describe '#find_by_name!' do
      it 'returns entry type with given name' do
        entry_types = EntryTypes.new
        entry_type = TestEntryType.new(name: 'test')

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
