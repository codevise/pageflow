module Pageflow
  class UserMailer < ActionMailer::Base
    include Resque::Mailer

    def invitation(options)
      @user = User.find(options['user_id'])
      mail(:to => @user.email, :subject => t('.subject'), :from => Pageflow.config.mailer_sender)
    end
  end
end
