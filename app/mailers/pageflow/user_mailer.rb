module Pageflow
  class UserMailer < ActionMailer::Base
    include Resque::Mailer

    def invitation(options)
      @user = User.find(options['user_id'])
      I18n.with_locale(@user.locale) do
        headers('X-Language' => I18n.locale)
        mail(:to => @user.email, :subject => t('.subject'), :from => Pageflow.config.mailer_sender)
      end
    end
  end
end
