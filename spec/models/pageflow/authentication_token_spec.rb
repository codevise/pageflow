require 'spec_helper'
require 'symmetric_encryption/core'

module Pageflow
  describe AuthenticationToken do
    describe 'attributes' do
      it 'ignores the expired tokens' do
        user = create(:user)
        AuthenticationToken.create_auth_token(user.id,
                                              'default',
                                              '4321',
                                              1.day.ago.to_i)
        result = AuthenticationToken.find_auth_token(user, 'default')
        expect(result).to be_empty
      end

      it 'authentication token is encrypted before saving' do
        user = create(:user)
        AuthenticationToken.create_auth_token(user.id,
                                              'default',
                                              '4321',
                                              1.year.after.to_i)
        result = AuthenticationToken.find_auth_token(user, 'default').first

        expect(result.read_attribute(:auth_token)).to match(SymmetricEncryption.encrypt('4321'))
        expect(result.auth_token).to match('4321')
      end
    end
  end
end
