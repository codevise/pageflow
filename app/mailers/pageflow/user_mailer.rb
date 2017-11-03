module Pageflow
  class UserMailer < ActionMailer::Base
    include Resque::Mailer

    def invitation(options)
      # Different versions of resque_mailer either pass:
      #
      # - Hash with string keys (<= 2.4.0)
      # - Hash with symbol keys (2.4.1)
      # - Hash with both string and symbol keys (2.4.2)
      # - HashWithIndifferentAccess (2.4.3)
      #
      # Symbolize keys to support 2.4.1, but do not use bang version
      # (i.e. `smbolize_keys!`) since that is not supported by
      # HashWithIndifferentAccess.
      options = options.symbolize_keys

      @user = User.find(options[:user_id])
      @password_token = options[:password_token]

      I18n.with_locale(@user.locale) do
        headers('X-Language' => I18n.locale)
        mail(to: @user.email, subject: t('.subject'), from: Pageflow.config.mailer_sender)
      end
    end
  end
end
