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
