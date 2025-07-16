module Pageflow
  module UrlTemplate # rubocop:todo Style/Documentation
    extend self

    def from_attachment(attachment, *style)
      insert_id_partition_placeholder(attachment.url(*style))
    end

    private

    def insert_id_partition_placeholder(url)
      replace_last_group_of_digit_segments(url, with: '/:id_partition/')
    end

    def replace_last_group_of_digit_segments(str, with:)
      str.reverse.sub(%r'/(\d{3}/)+', with.reverse).reverse
    end
  end
end
