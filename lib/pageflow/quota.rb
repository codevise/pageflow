module Pageflow
  module Quota
    class ExceededError < RuntimeError
      attr_reader :quota_name

      def initialize(quota_name)
        @quota_name = quota_name
      end
    end

    def exceeded?(name, account)
      raise(NotImplementedError, 'Quota#exceeded? must be implemented.')
    end

    def state_description(name, account)
      raise(NotImplementedError, 'Quota#state_description must be implemented.')
    end

    def verify!(name, account)
      raise(ExceededError.new(name), "Quota #{name} exceeded.") if exceeded?(name, account)
    end

    class Unlimited
      include Quota

      def exceeded?(name, account)
        false
      end

      def state_description(name, account)
        nil
      end
    end
  end
end
