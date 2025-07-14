module Pageflow
  module Suspendable
    def active_for_authentication?
      super && !suspended?
    end

    def suspended?
      suspended_at?
    end

    def suspend!
      return if suspended?

      self.suspended_at = Time.zone.now
      save(validate: false)
    end

    def unsuspend!
      return unless suspended?

      self.suspended_at = nil
      save(validate: false)
    end
  end
end
