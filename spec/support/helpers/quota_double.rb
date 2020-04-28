module QuotaDouble
  AVAILABLE_DESCRIPTION = 'Quota available'.freeze
  EXHAUSTED_DESCRIPTION = 'Quota exhausted'.freeze
  EXCEEDED_DESCRIPTION = 'Quota exceeded'.freeze

  def self.available
    Class.new(Pageflow::Quota) do
      def state
        'available'
      end

      def state_description
        AVAILABLE_DESCRIPTION
      end
    end
  end

  def self.exhausted
    Class.new(Pageflow::Quota) do
      def state
        'exhausted'
      end

      def state_description
        EXHAUSTED_DESCRIPTION
      end
    end
  end

  def self.exceeded
    Class.new(Pageflow::Quota) do
      def state
        'exceeded'
      end

      def state_description
        EXCEEDED_DESCRIPTION
      end
    end
  end

  def self.account_exhaustible(exhausted_accounts)
    Class.new(Pageflow::Quota) do
      @exhausted_accounts = exhausted_accounts

      def self.exhausted_accounts
        @exhausted_accounts
      end

      def state
        self.class.exhausted_accounts.include?(account) ? 'exhausted' : 'available'
      end

      def state_description
        state == 'exhausted' ? EXHAUSTED_DESCRIPTION : AVAILABLE_DESCRIPTION
      end
    end
  end
end
