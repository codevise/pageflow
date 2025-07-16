require 'spec_helper'

module Pageflow
  describe Ability do
    context 'of admin' do
      it 'can use_files of all entries' do
        user = create(:user, :admin)
        entry = create(:entry)
        ability = Ability.new(user)

        expect(Entry.accessible_by(ability, :use_files)).to include(entry)
      end

      it 'can manage file used in an entry of other account' do
        user = create(:user, :admin)
        entry = create(:entry)
        file = create(:audio_file)
        create(:file_usage, revision: entry.draft, file:)
        ability = Ability.new(user)

        expect(ability.can?(:manage, file)).to eq(true)
      end
    end
  end
end
