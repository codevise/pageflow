module Pageflow
  class UserMailer < ActionMailer::Base
    def invitation(options)
      @user = options[:user]
      @password_token = options[:password_token]

      I18n.with_locale(@user.locale) do
        headers('X-Language' => I18n.locale)
        mail(to: @user.email, subject: t('.subject'), from: Pageflow.config.mailer_sender)
      end
    end
  end
end
