require 'symmetric_encryption/core'

Pageflow.after_global_configure do |config|
  SymmetricEncryption.cipher = SymmetricEncryption::Cipher.new(
    key: config.encryption_options[:key],
    iv:  config.encryption_options[:iv],
    cipher_name: 'aes-128-cbc'
  )
end
