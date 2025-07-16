require 'prosopite'

Prosopite.raise = true

# Uses Rails.backtrace_cleaner by default which only leaves lines
# inside the dummy app
Prosopite.backtrace_cleaner = ActiveSupport::BacktraceCleaner.new

# Only consider lines from within the gem to prevent false
# negatives caused by cached missing methods in gems like
# `builder` (see https://github.com/charkost/prosopite/pull/79)
Prosopite.location_backtrace_cleaner = ActiveSupport::BacktraceCleaner.new
Prosopite.location_backtrace_cleaner.add_silencer { |line| !/pageflow/.match?(line) }

module NPlusOneQueriesTestHelper
  def detect_n_plus_one_queries(&)
    Prosopite.scan(&)
  end
end

RSpec.configure do |config|
  config.include(NPlusOneQueriesTestHelper)
end
