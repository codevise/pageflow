# Make sure no jobs are enqueued from a rolled back
# transaction. Pageflow mainly triggers jobs in conjunction with state
# machine transitions. So this patch ensures state db state and
# enqueued jobs stay in sync.
#
# Note the after_transaction yields immediately if there is no open
# transcation.

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
