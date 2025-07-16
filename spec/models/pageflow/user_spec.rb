require 'spec_helper'

module Pageflow
  describe User do
    describe '#update_with_password' do
      it 'allows to update profile attributes without password' do
        user = create(:user, first_name: 'John', last_name: 'J.')

        user.update_with_password(first_name: 'Danny', last_name: 'D.')

        expect(user.first_name).to eq('Danny')
        expect(user.last_name).to eq('D.')
      end

      it 'allows to update password when given current password' do
        user = create(:user, password: '@qwert123')

        user.update_with_password(current_password: '@qwert123', password: '@new12345',
                                  password_confirmation: '@new12345')

        expect(user.errors).to be_empty
      end

      it 'does not allow to update password without current password' do
        user = create(:user, password: '@qwert123')

        user.update_with_password(password: '@new12345', password_confirmation: '@new12345')

        expect(user.errors).not_to be_empty
      end

      it 'does not allow to set empty first and last name' do
        user = create(:user, first_name: 'Bob', last_name: 'Bing')

        user.update_with_password(first_name: '', last_name: '')

        expect(user.reload.first_name).to eq('Bob')
      end
    end

    describe '#destroy_with_password' do
      it 'allows to destroy the user when given current password' do
        user = create(:user, password: '@qwert123')

        user.destroy_with_password('@qwert123')

        expect(user).to be_destroyed
      end

      context 'without correct password' do
        it 'adds error on the current_password' do
          user = create(:user, password: '@qwert123')

          user.destroy_with_password('wrong')

          expect(user.errors[:current_password]).to be_present
        end

        it 'does not allow to destroy the user when given wrong password' do
          user = create(:user, password: '@qwert123')

          user.destroy_with_password('wrong')

          expect(user).not_to be_new_record
        end
      end
    end

    describe '#locale' do
      it 'falls back to default_locale' do
        user = build(:user, locale: '')

        expect(user.locale).to eq(I18n.default_locale.to_s)
      end

      it 'returns present attribute' do
        user = build(:user, locale: 'fr')

        expect(user.locale).to eq('fr')
      end

      it 'ensures folder belongs to same account' do
        user = build(:user, locale: 'not-a-locale')

        expect(user).to have(1).error_on(:locale)
      end
    end
  end
end
