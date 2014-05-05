require 'devise/async'

Devise::Async.enabled = Rails.env.production?
Devise::Async.backend = :resque
