require 'omniauth'

OmniAuth.config.test_mode = true
OmniAuth.config.mock_auth[:default] = OmniAuth::AuthHash.new(
  provider: 'default',
  uid: '123545',
  credentials: {
    token: '123456789',
    expires: true,
    expires_at: 925_036_800_00
  }
)
