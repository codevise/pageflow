module Pageflow
  class UserMailer < ActionMailer::Base
    include Resque::Mailer

    default :from => "pageflow@codevise.de"

    def invitation(options)
      @user = User.find(options['user_id'])
      mail(:to => @user.email, :subject => t('.subject'))
    end
  end
end
