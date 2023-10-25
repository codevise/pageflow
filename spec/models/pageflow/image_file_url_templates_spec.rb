require 'spec_helper'

module Pageflow
  describe ImageFileUrlTemplates do
    it 'returns templates indexed by variant name' do
      result = ImageFileUrlTemplates.new.call

      expect(result[:large])
        .to include('pageflow/image_files/attachment_on_s3s/' \
                    ':id_partition/large/:basename.:processed_extension')
    end

    it 'includes original URL' do
      result = ImageFileUrlTemplates.new.call

      expect(result[:original])
        .to include('pageflow/image_files/attachment_on_s3s/' \
                    ':id_partition/original/:basename.:extension')
    end
  end
end
