require 'spec_helper'

module Pageflow
  describe UserMailer do
    describe '#invitation' do
      it 'sends from configured mailer_sender address' do
        user = create(:user)
        Pageflow.config.mailer_sender = 'test@example.com'

        mail = UserMailer.invitation(user_id: user.id)

        expect(mail.from).to eq(['test@example.com'])
      end

      it 'supports string keys passed by resque_mailer < 2.4.1' do
        user = create(:user)
        Pageflow.config.mailer_sender = 'test@example.com'

        mail = UserMailer.invitation('user_id' => user.id)

        expect(mail.from).to eq(['test@example.com'])
      end

      it 'uses locale of receiving user' do
        user = create(:user, locale: 'de')

        mail = UserMailer.invitation(user_id: user.id)

        expect(mail.header['X-Language'].value).to eq('de')
      end
    end
  end
end
