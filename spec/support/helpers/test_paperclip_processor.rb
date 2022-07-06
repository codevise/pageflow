class TestPaperclipProcessor < Paperclip::Processor
  cattr_reader :invoked_with_options, default: []

  def make
    invoked_with_options << options
    Tempfile.new
  end

  def self.reset
    invoked_with_options.clear
  end
end
