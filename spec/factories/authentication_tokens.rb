module Pageflow
  FactoryBot.define do
    factory :authentication_token, class: AuthenticationToken do
      user
      provider { 'default' }
      auth_token do
        'QEVuQwAAElPhP47/EQeKvGyQL0asd9DITXSBzT4fg5SL++gkPCuPJGW8LFHyuvEtp5X4sZTn++'\
        'I59UKjJ5rEB67k2p8iJw+8nNVFBZ288G6DlSpTteDLvoIvBSbremWg7Hz123apFkQCGTJuZV61eu'\
        'QVhQ5KAvnLl0HwJ1JSjM0aXUUF1fL1gEOFaoB2x/T56p4BnKzZjtIWfuB+pmtygsL47C8TTyjint0V'\
        'u7Oa47C/uMngIRb6AZYi4FU9uPXkJonakaCwI'
      end
      expiry_time { Time.at(925_036_800_00) }
    end
  end
end
