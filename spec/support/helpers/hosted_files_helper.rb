module FactoryBot
  module Syntax
    module Methods
      def simulate_direct_upload(hosted_file)
        FileUtils.mkdir_p(File.dirname(hosted_file.attachment.path))
        attachment_path = Pageflow::Engine.root.join('spec',
                                                     'fixtures',
                                                     hosted_file.attachment_on_s3_file_name)
        unless File.identical?(attachment_path, hosted_file.attachment.path)
          FileUtils.cp(attachment_path, hosted_file.attachment.path)
        end
      end
    end
  end
end
