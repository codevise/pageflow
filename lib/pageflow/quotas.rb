module Pageflow
  class Quotas
    def initialize
      @factories = HashWithIndifferentAccess.new
    end

    def register(name, factory)
      @factories[name] = factory
    end

    def get(name, account)
      @factories.fetch(name, Quota::Unlimited).new(name, account)
    end
  end
end
