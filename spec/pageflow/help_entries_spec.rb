require 'spec_helper'

module Pageflow
  describe HelpEntries do
    describe '#register' do
      it 'appends entries in order' do
        help_entries = HelpEntries.new

        help_entries.register('entry_1')
        help_entries.register('entry_2')

        expect(help_entries.map(&:name)).to eq(['entry_1', 'entry_2'])
      end

      it 'allows ordering by priority' do
        help_entries = HelpEntries.new

        help_entries.register('default')
        help_entries.register('low', priority: 9)
        help_entries.register('high', priority: 11)

        expect(help_entries.map(&:name)).to eq(['high', 'default', 'low'])
      end

      it 'allows registering nested entries' do
        help_entries = HelpEntries.new

        help_entries.register('parent')
        help_entries.register('child', parent: 'parent')

        expect(help_entries.first.children.first.name).to eq('child')
      end

      it 'throws descriptive error if parent is unknown' do
        help_entries = HelpEntries.new

        expect {
          help_entries.register('child', parent: 'parent')
        }.to raise_error(/Help entry .* not found/)
      end
    end

    describe '#flat' do
      it 'returns flat array including nested entries' do
        help_entries = HelpEntries.new

        help_entries.register('parent')
        help_entries.register('child', parent: 'parent')

        expect(help_entries.flat.map(&:name)).to eq(['parent', 'child'])
      end
    end
  end
end
