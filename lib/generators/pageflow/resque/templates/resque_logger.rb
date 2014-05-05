# resque-logger is required by the state_machine_job gem to write
# debug output to logs files. Each queue has its own log file in the
# directory specified below.

require 'fileutils'

log_dir = Rails.root.join('log', 'jobs', Rails.env)
FileUtils.mkdir_p(log_dir)

Resque.logger_config = {
  folder: log_dir,
  class_name: Logger,
  class_args: [ 'daily', 1.kilobyte ],
  level:      Logger::INFO,
  formatter:  Logger::Formatter.new
}
