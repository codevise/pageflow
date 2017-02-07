module Pageflow
  module UrlTemplate
    module_function

    def from_attachment(attachment, *style)
      insert_id_partition_placeholder(attachment.url(*style))
    end

    def insert_id_partition_placeholder(url)
      url.gsub(%r'(\d{3}/)+', ':id_partition/')
    end
  end
end
