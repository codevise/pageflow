require 'spec_helper'

module Pageflow
  describe AuthenticationToken do
    describe 'attributes' do
      it 'authentication token is encrypted before saving' do
        user = create(:user)
        token = AuthenticationToken.create_auth_token(user.id,
                                                      'default',
                                                      '4321',
                                                      925_036_800_00)
        expect(token.read_attribute(:auth_token)).to match(token.encrypted_token)
      end
    end
  end
end
