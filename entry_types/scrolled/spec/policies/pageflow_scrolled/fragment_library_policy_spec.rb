require 'spec_helper'

module PageflowScrolled
  RSpec.describe FragmentLibraryPolicy do
    describe 'Scope#read' do
      it 'includes libraries of entries user is previewer of' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')

        libraries = FragmentLibraryPolicy::Scope.new(user, FragmentLibrary.all).read

        expect(libraries.map(&:id)).to eq([entry.id])
      end

      it 'skips libraries of entries user is not member of' do
        user = create(:user)
        create(:entry, type_name: 'scrolled', fragment_library: 'shared')

        libraries = FragmentLibraryPolicy::Scope.new(user, FragmentLibrary.all).read

        expect(libraries.to_a).to be_empty
      end

      it 'includes all libraries for admin' do
        user = create(:user, :admin)
        entry = create(:entry, type_name: 'scrolled', fragment_library: 'shared')

        libraries = FragmentLibraryPolicy::Scope.new(user, FragmentLibrary.all).read

        expect(libraries.map(&:id)).to include(entry.id)
      end

      it 'narrows passed scope' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        other_account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')
        create(:entry, type_name: 'scrolled', account: other_account, fragment_library: 'shared')

        libraries = FragmentLibraryPolicy::Scope.new(user, FragmentLibrary.where(account:)).read

        expect(libraries.map(&:id)).to eq([entry.id])
      end
    end

    describe '#read?' do
      it 'is true if user is previewer of library entry' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')
        library = FragmentLibrary.new(Pageflow::DraftEntry.new(entry))

        expect(FragmentLibraryPolicy.new(user, library).read?).to eq(true)
      end

      it 'is false if user is not member of library entry' do
        user = create(:user)
        entry = create(:entry, type_name: 'scrolled', fragment_library: 'shared')
        library = FragmentLibrary.new(Pageflow::DraftEntry.new(entry))

        expect(FragmentLibraryPolicy.new(user, library).read?).to eq(false)
      end

      it 'is true for admin' do
        user = create(:user, :admin)
        entry = create(:entry, type_name: 'scrolled', fragment_library: 'shared')
        library = FragmentLibrary.new(Pageflow::DraftEntry.new(entry))

        expect(FragmentLibraryPolicy.new(user, library).read?).to eq(true)
      end
    end
  end
end
