module Pageflow
  class EditLock < ApplicationRecord
    scope :active, (lambda do
      time = Time.now - EditLock.time_to_live
      where('pageflow_edit_locks.updated_at >= ?', time)
    end)

    class Error < RuntimeError
      def code
        self.class.name.split('::').last.underscore
      end
    end

    class HeldByOtherUserError < Error
      attr_reader :user

      def initialize(user)
        @user = user
      end
    end

    class HeldByOtherSessionError < Error; end
    class NotHeldError < Error; end

    belongs_to :user
    belongs_to :entry, :inverse_of => :edit_lock

    def self.time_to_live
      timer_tolerance = 2.3
      Pageflow.config.edit_lock_polling_interval * timer_tolerance
    end

    def held_by?(user)
      self.user == user
    end

    def matches?(id)
      self.id == id.to_i
    end

    def timed_out?
      Time.now > updated_at + EditLock.time_to_live
    end

    def acquire(current_user, options = {})
      verify!(current_user, options)
    rescue Error
      if options[:force] || timed_out?
        entry.create_edit_lock(:user => current_user)
      else
        raise
      end
    end

    def release(current_user)
      if user == current_user
        destroy
      end
    end

    def verify!(current_user, options)
      raise HeldByOtherUserError.new(user) unless held_by?(current_user)
      raise HeldByOtherSessionError unless matches?(options[:id])
      touch
    end

    class Null
      attr_reader :entry

      def initialize(entry)
        @entry = entry
      end

      def held_by?(user)
        false
      end

      def blank?
        true
      end

      def acquire(user, options = {})
        entry.create_edit_lock!(:user => user)
      end

      def release(user)
      end

      def verify!(user, options = {})
        raise NotHeldError.new
      end
    end
  end
end
