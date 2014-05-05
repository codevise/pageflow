# Deliver devise mails inside resque jobs.

require 'devise/async'

Devise::Async.enabled = Rails.env.production?
Devise::Async.backend = :resque
