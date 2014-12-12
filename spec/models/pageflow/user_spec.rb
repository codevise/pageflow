require 'spec_helper'

module Pageflow
  describe User do
    describe '#update_with_password' do
      it 'allows to update profile attributes without password' do
        user = create(:user, :first_name => 'John', :last_name => 'J.')

        user.update_with_password(:first_name => 'Danny', :last_name => 'D.')

        expect(user.first_name).to eq('Danny')
        expect(user.last_name).to eq('D.')
      end

      it 'allows to update password when given current password' do
        user = create(:user, :password => '@qwert123')

        user.update_with_password(:current_password => '@qwert123', :password => '@new12345', :password_confirmation => '@new12345')

        expect(user.errors).to be_empty
      end

      it 'does not allow to update password without current password' do
        user = create(:user, :password => '@qwert123')

        user.update_with_password(:password => '@new12345', :password_confirmation => '@new12345')

        expect(user.errors).not_to be_empty
      end
    end

    describe '#destroy_with_password' do
      it 'allows to destroy the use  when given current password' do
        user = create(:user, :password => '@qwert123')

        user.destroy_with_password('@qwert123')

        expect(user).to be_new_record
      end

      context 'without correct password' do
        it 'adds error on the current_password' do
          user = create(:user, :password => '@qwert123')

          user.destroy_with_password('wrong')

          expect(user.errors[:current_password]).to be_present
        end

        it 'allows to destroy the use  when given current password' do
          user = create(:user, :password => '@qwert123')

          user.destroy_with_password('wrong')

          expect(user).not_to be_new_record
        end
      end
    end

    describe '#locale' do
      it 'falls back to default_locale' do
        user = build(:user, locale: '')

        expect(user.locale).to eq(I18n.default_locale)
      end

      it 'returns present attribute' do
        user = build(:user, locale: 'fr')

        expect(user.locale).to eq('fr')
      end
    end
  end
end
