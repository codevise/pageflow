require 'attr_encrypted'

module Pageflow
  # AuthenticationToken stores the tokens with expiry time against user and provider
  class AuthenticationToken < ApplicationRecord
    belongs_to :user, class_name: 'User'
    attr_encrypted :token, key: ENV['AUTH_TOKEN_ENC_KEY']
    default_scope -> { where(['expiry_time > :expiry OR expiry_time is NULL', expiry: Time.zone.now]) }

    def self.create_auth_token(user_id, auth_provider, auth_token, expiry_time)
      token = AuthenticationToken.new
      token.user_id = user_id
      token.provider = auth_provider
      token.token = auth_token
      token.auth_token = token.encrypted_token
      if expiry_time.present? && expiry_time.is_a?(Integer)
        token.expiry_time = Time.at(expiry_time)
      end
      token.save!
      token
    end

    def self.update_token(record, token, expiry_time)
      record.token = token
      record.update(auth_token: record.encrypted_token,
                    expiry_time: Time.at(expiry_time))
    end

    def self.find_auth_token(current_user, provider)
      where(user_id: current_user.id,
            provider: provider)
    end
  end
end
