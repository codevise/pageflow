module Pageflow
  class Hooks # rubocop:todo Style/Documentation
    def initialize
      @subscribers = Hash.new do |hash, key|
        hash[key] = []
      end
    end

    def on(event, subscriber)
      @subscribers[event] << subscriber
    end

    def invoke(event, *args)
      @subscribers[event].each do |subscriber|
        subscriber.call(*args)
      end
    end
  end
end
