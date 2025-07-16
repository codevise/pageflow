module FactoryBot
  module Syntax
    module Methods
      def simulate_direct_upload(uploadable_file)
        FileUtils.mkdir_p(File.dirname(uploadable_file.attachment.path))
        attachment_path = Pageflow::Engine.root.join('spec',
                                                     'fixtures',
                                                     uploadable_file.file_name)
        return if File.identical?(attachment_path, uploadable_file.attachment.path)

        FileUtils.cp(attachment_path, uploadable_file.attachment.path)
      end
    end
  end
end
