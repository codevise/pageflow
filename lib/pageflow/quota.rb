module Pageflow
  class Quota
    class ExhaustedError < RuntimeError
      attr_reader :quota

      def initialize(quota)
        @quota = quota
      end
    end

    class ExceededError < ExhaustedError; end

    attr_reader :name, :account

    def initialize(name, account)
      @name = name
      @account = account
    end

    def state
      raise(NotImplementedError,
            'Quota#state must be implemented and return either "available", "exhausted" or "exceeded".')
    end

    def state_description
      raise(NotImplementedError, 'Quota#state_description must be implemented.')
    end

    def available?
      state == 'available'
    end

    def exhausted?
      !available?
    end

    def exceeded?
      state == 'exceeded'
    end

    def verify_available!
      raise(ExhaustedError.new(self), "Quota '#{name}' exhausted.") unless available?
    end

    def verify_not_exceeded!
      raise(ExceededError.new(self), "Quota '#{name}' exceeded.") if exceeded?
    end

    def assume(_assumptions)
      self
    end

    class Unlimited < Quota
      def state
        'available'
      end

      def state_description
        nil
      end
    end
  end
end
