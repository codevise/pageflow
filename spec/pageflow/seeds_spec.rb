require 'spec_helper'

module Pageflow
  describe Seeds do
    describe '#account' do
      module SeedsDsl
        extend Seeds
      end

      it 'creates account' do
        account = SeedsDsl.account(name: 'example')

        expect(account).to be_persisted
      end

      it 'does not create account if account with that name exists' do
        account = create(:account, name: 'example')

        result = SeedsDsl.account(name: 'example')

        expect(result).to eq(account)
      end

      it 'creates default theming' do
        account = SeedsDsl.account(name: 'example')

        expect(account.default_theming).to be_persisted
      end

      it 'allows overriding default theming' do
        account = SeedsDsl.account(name: 'example') do |created_account|
          created_account.name = 'example'

          SeedsDsl.build_default_theming_for(created_account) do |theming|
            theming.imprint_link_label = 'Other Text'
          end
        end

        expect(account.default_theming.imprint_link_label).to eq('Other Text')
      end
    end

    describe '#user' do
      it 'creates user' do
        user = SeedsDsl.user(email: 'editor@example.com')

        expect(user).to be_persisted
      end

      it 'does not create user if user with email exists' do
        user = create(:user, email: 'editor@example.com')

        result = SeedsDsl.user(email: 'editor@example.com')

        expect(result).to eq(user)
      end

      it 'sets password confirmation' do
        user = SeedsDsl.user(email: 'editor@example.com', password: '!Other123')

        expect(user).to be_persisted
      end

      it 'uses default user password' do
        SeedsDsl.default_user_password('!Other123')
        user = SeedsDsl.user(email: 'editor@example.com')

        expect(user.valid_password?('!Other123')).to be true
      end

      it 'allows overriding attributes in block' do
        user = SeedsDsl.user(email: 'editor@exmaple.com') do |created_user|
          created_user.first_name = 'Waldemar'
        end

        expect(user).to be_persisted
      end
    end

    describe '#sample_entry' do
      it 'creates entry for account' do
        entry = SeedsDsl.sample_entry(account: create(:account), title: 'Example')

        expect(entry).to be_persisted
      end

      it 'does not create entry if entry with same title exists for account' do
        account = create(:account)
        entry = create(:entry, account: account, title: 'Example')

        result = SeedsDsl.sample_entry(account: account, title: 'Example')

        expect(result).to eq(entry)
      end

      it 'creates sample storyline' do
        entry = SeedsDsl.sample_entry(account: create(:account), title: 'Example')

        expect(entry.draft.storylines).not_to be_empty
      end

      it 'creates sample chapters' do
        entry = SeedsDsl.sample_entry(account: create(:account), title: 'Example')

        expect(entry.draft.chapters).not_to be_empty
      end

      it 'allows overriding attributes in block' do
        account = create(:account)
        theming = create(:theming, account: account)

        entry = SeedsDsl.sample_entry(account: account, title: 'Example') do |created_entry|
          created_entry.theming = theming
        end

        expect(entry.theming).to eq(theming)
      end
    end

    describe '#membership' do
      it 'creates entry membership' do
        user = create(:user)
        entry = create(:entry)

        SeedsDsl.membership(user: user, entity: entry, role: :previewer)

        expect(entry.users).to include(user)
        expect(user.entries).to include(entry)
      end

      it 'creates account membership' do
        user = create(:user)
        account = create(:account)

        SeedsDsl.membership(user: user, entity: account, role: :member)

        expect(account.users).to include(user)
        expect(user.accounts).to include(account)
      end
    end
  end
end
