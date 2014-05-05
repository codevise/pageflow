require 'ar_after_transaction'
require 'resque'

Resque.class_eval do
  class << self
    alias_method :enqueue_without_transaction, :enqueue
    def enqueue(*args)
      if Resque.inline?
        enqueue_without_transaction(*args)
      else
        ActiveRecord::Base.after_transaction do
          enqueue_without_transaction(*args)
        end
      end
    end
  end
end
