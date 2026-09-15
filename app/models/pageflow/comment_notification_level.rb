module Pageflow
  # Whether participation is required before comment activity notifies
  # the user.
  #
  # A level whose condition is participation at some scope is storable
  # only above that scope: choosing a level for one thread already
  # settles whether the user has commented in it.
  #
  # @api private
  module CommentNotificationLevel
    ALL_ACTIVITY = 'all_activity'.freeze
    PARTICIPATING_THREADS = 'participating_threads'.freeze
    MUTED = 'muted'.freeze

    STORABLE_PER_ACCOUNT = [ALL_ACTIVITY, PARTICIPATING_THREADS, MUTED].freeze
    STORABLE_PER_ENTRY = [ALL_ACTIVITY, PARTICIPATING_THREADS, MUTED].freeze
    STORABLE_PER_THREAD = [ALL_ACTIVITY, MUTED].freeze

    SYSTEM_DEFAULTS = {assigned: ALL_ACTIVITY, other: PARTICIPATING_THREADS}.freeze

    # Kept in sync with notifies in
    # entry_types/scrolled/package/src/review/notifications.js. Both are
    # held to the cases in spec/fixtures/comment_notification_rules.json.
    def self.notifies?(level, participated)
      case level
      when ALL_ACTIVITY
        true
      when PARTICIPATING_THREADS
        participated
      when MUTED
        false
      end
    end
  end
end
