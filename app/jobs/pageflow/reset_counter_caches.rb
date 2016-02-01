module Pageflow
  class ResetCounterCachesJob
    @queue = :default

    extend StateMachineJob

    def self.perform_with_result(file, options = {})
      Account.find_each { |account| Account.reset_counters(account.id, :entries, :users) }
      :ok
    end

  end
end
