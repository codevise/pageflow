require 'spec_helper'

module Pageflow
  describe OtherFileUrlTemplates do
    it 'includes original URL with extname placeholder' do
      result = OtherFileUrlTemplates.new.call

      expect(result[:original])
        .to include('pageflow/other_files/attachment_on_s3s/' \
                    ':id_partition/original/:basename.:extension')
    end
  end
end
