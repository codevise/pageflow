require 'spec_helper'

module Pageflow
  describe UserMailer do
    describe '#invitation' do
      it 'sends from configured mailer_sender address' do
        user = create(:user)
        Pageflow.config.mailer_sender = 'test@example.com'

        mail = UserMailer.invitation('user_id' => user.id)

        expect(mail.from).to eq(['test@example.com'])
      end
    end
  end
end
