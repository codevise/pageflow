require 'spec_helper'

module Pageflow
  describe FilePolicy do
    describe '#manage' do
      it 'allows to manage a file when user may edit one of its entries' do
        user = create(:user)
        entry = create(:entry, with_editor: user)
        file = create(:audio_file)
        create(:file_usage, revision: entry.draft, file:)

        policy = FilePolicy.new(user, file)

        expect(policy).to permit_action(:manage)
      end

      it 'allows to manage a file when user may edit one of its entries via its account' do
        user = create(:user)
        account = create(:account, with_editor: user)
        entry = create(:entry, account:)
        file = create(:audio_file)
        create(:file_usage, revision: entry.draft, file:)

        policy = FilePolicy.new(user, file)

        expect(policy).to permit_action(:manage)
      end

      it 'forbids to manage a file when user cannot edit one of its entries or accounts' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)
        other_entry = create(:entry, with_previewer: user)
        file = create(:audio_file)
        create(:file_usage, revision: entry.draft, file:)
        create(:file_usage, revision: other_entry.draft, file:)

        policy = FilePolicy.new(user, file)

        expect(policy).not_to permit_action(:manage)
      end
    end

    describe '#use' do
      it 'allows to use a file when user may preview one of its entries' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)
        file = create(:audio_file)
        create(:file_usage, revision: entry.draft, file:)

        policy = FilePolicy.new(user, file)

        expect(policy).to permit_action(:use)
      end

      it 'allows to use a file when user may preview one of its entries via its account' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        entry = create(:entry, account:)
        file = create(:audio_file)
        create(:file_usage, revision: entry.draft, file:)

        policy = FilePolicy.new(user, file)

        expect(policy).to permit_action(:use)
      end

      it 'forbids to use a file when user cannot preview one of its entries or accounts' do
        user = create(:user)
        entry = create(:entry)
        file = create(:audio_file)
        create(:file_usage, revision: entry.draft, file:)

        policy = FilePolicy.new(user, file)

        expect(policy).not_to permit_action(:use)
      end
    end
  end
end
