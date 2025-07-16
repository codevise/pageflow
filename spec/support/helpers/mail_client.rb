class MailClient
  attr_reader :email, :deliveries

  class MissingDeliveryError < StandardError
    def initialize(options)
      super(
        "Expected #{options[:name]} to have been delivered to #{options[:to]}." \
        "\n\nOther deliveries:\n#{other_deliveries}"
      )
    end

    private

    def other_deliveries
      ActionMailer::Base.deliveries.map { |delivery|
        "- from #{delivery[:from]} to #{delivery[:to]}: #{delivery.subject}\n"
      }.join
    end
  end

  def initialize(email, deliveries)
    @email = email
    @deliveries = deliveries
  end

  def invitation_mail
    delivery_by_subject('pageflow.user_mailer.invitation.subject')
  end

  def receive_invitation_link
    fetch_link_from(invitation_mail) { raise('Expected to find link in invitation mail.') }
  end

  def password_reset_mail
    delivery_by_subject('devise.mailer.reset_password_instructions.subject')
  end

  def receive_password_reset_link
    fetch_link_from(password_reset_mail) { raise('Expected to find link in password reset mail.') }
  end

  def self.of(email)
    new(email, ActionMailer::Base.deliveries.select { |delivery| delivery[:to].to_s == email })
  end

  private

  def delivery_by_subject(subject)
    deliveries.detect { |delivery| delivery.subject == I18n.t(subject) } ||
      raise(MissingDeliveryError.new(name: subject, to: email))
  end

  def fetch_link_from(mail)
    match = (mail.html_part || mail).body.match(/href="([^"]+)"/)
    (match && match[1]) || yield
  end
end
