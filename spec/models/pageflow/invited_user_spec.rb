require 'spec_helper'

module Pageflow
  describe InvitedUser do
    it 'is valid without password' do
      user = InvitedUser.new(attributes_for(:valid_user,
                                            password: nil,
                                            password_confirmation: nil))

      expect(user).to be_valid
    end

    describe '#send_invitation!' do
      it 'delivers invitation' do
        user = create(:invited_user)

        expect(UserMailer).to receive(:invitation)
          .with(user: kind_of(User), password_token: kind_of(String))
          .and_return(double(deliver_later: true))

        user.send_invitation!
      end

      it 'generates password reset token' do
        user = build(:invited_user)

        user.send_invitation!

        expect(user.reset_password_token).to be_present
      end
    end

    describe '#save' do
      it 'sends invitation on creation' do
        user = build(:invited_user, password: nil)

        expect(UserMailer).to receive(:invitation)
          .with(user: kind_of(User),
                password_token: kind_of(String))
          .and_return(double(deliver_later: true))

        user.save
      end

      it 'generates password reset token' do
        user = build(:invited_user, password: nil)

        user.save

        expect(user.reset_password_token).to be_present
      end

      it 'does not send invitation on update' do
        user = create(:invited_user, password: nil)

        expect(UserMailer).not_to receive(:invitation)
        user.update_attributes(first_name: 'new name')
      end
    end
  end
end
