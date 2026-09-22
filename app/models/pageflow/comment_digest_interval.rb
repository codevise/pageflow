module Pageflow
  # An axis of its own, beside the notification level: muting a story
  # and turning its mail off are different things.
  #
  # @api private
  module CommentDigestInterval
    CONTINUOUS = 'continuous'.freeze
    NEVER = 'never'.freeze

    STORABLE = [CONTINUOUS, NEVER].freeze

    SYSTEM_DEFAULT = CONTINUOUS

    def self.enabled?(member_interval, account_interval)
      interval = member_interval.presence || account_interval.presence || SYSTEM_DEFAULT

      interval != NEVER
    end
  end
end
