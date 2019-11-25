require 'symmetric_encryption/core'

module Pageflow
  # AuthenticationToken stores the tokens with expiry time against user and provider
  class AuthenticationToken < ApplicationRecord
    belongs_to :user, class_name: 'User'
    default_scope -> { where(['expiry_time > :expiry', expiry: Time.zone.now]) }

    def auth_token
      SymmetricEncryption.decrypt(read_attribute(:auth_token))
    end

    def auth_token=(token)
      write_attribute(:auth_token, SymmetricEncryption.encrypt(token))
    end

    def self.create_auth_token(user_id, auth_provider, auth_token, expiry_time)
      token = AuthenticationToken.new
      token.user_id = user_id
      token.provider = auth_provider
      token.auth_token = auth_token
      token.expiry_time = Time.at(expiry_time) if expiry_time.present? && expiry_time.is_a?(Integer)
      token.save!
      token
    end

    def self.update_token(record, token, expiry_time)
      record.update(auth_token: token,
                    expiry_time: Time.at(expiry_time))
    end

    def self.find_auth_token(current_user, provider)
      where(user_id: current_user.id,
            provider: provider)
    end
  end
end
