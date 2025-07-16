module SuppressOutputTestHelper
  def suppress_output
    original_stdout = $stdout.clone
    original_stderr = $stderr.clone
    $stderr.reopen File.new(File::NULL, 'w')
    $stdout.reopen File.new(File::NULL, 'w')
    yield
  ensure
    $stdout.reopen original_stdout
    $stderr.reopen original_stderr
  end
end

RSpec.configure do |config|
  config.include(SuppressOutputTestHelper)
end
