module QuotaDouble
  def self.available
    Class.new(Pageflow::Quota) do
      def state
        'available'
      end

      def state_description
        'Quota available'
      end
    end
  end

  def self.exhausted
    Class.new(Pageflow::Quota) do
      def state
        'exhausted'
      end

      def state_description
        'Quota exhausted'
      end
    end
  end
end
