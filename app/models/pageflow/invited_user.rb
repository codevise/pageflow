module Pageflow
  # Specialized User class containing invitation logic used by in the
  # users admin.
  class InvitedUser < User
    before_create :prepare_invitation
    after_create :send_invitation

    def send_invitation!
      generate_reset_password_token! if should_generate_reset_token?
      send_invitation
    end

    private

    def password_required?
      false
    end

    def prepare_invitation
      generate_reset_password_token if should_generate_reset_token?
    end

    def send_invitation
      UserMailer.invitation('user_id' => id).deliver
    end
  end
end
