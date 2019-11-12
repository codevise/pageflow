module Pageflow
  # AuthenticationToken stores the tokens with expiry time against user and provider
  class AuthenticationToken < ApplicationRecord
    belongs_to :user, class_name: 'User'
    default_scope -> { where(['expiry_time > :expiry OR expiry_time is NULL', expiry: Time.zone.now]) }

    def self.find_auth_token(current_user, provider)
      where(user_id: current_user.id,
            provider: provider)
    end
  end
end
