require 'spec_helper'

require 'pageflow/lint'

module PageflowScrolled
  RSpec.describe 'lottie file type' do
    it 'is available under lottie_files collection name' do
      expect(PageflowScrolled.lottie_file_type.collection_name).to eq('lottie_files')
    end

    it 'provides url template for original attachment' do
      templates = PageflowScrolled.lottie_file_type.url_templates.call

      expect(templates[:original])
        .to include('lottie_files/attachment_on_s3s/' \
                    ':id_partition/original/:basename.:extension')
    end

    it 'is registered for scrolled entries with lottie_animation_content_element feature' do
      entry = create(:published_entry,
                     type_name: 'scrolled',
                     with_feature: 'lottie_animation_content_element')

      collection_names = Pageflow.config_for(entry).file_types.map(&:collection_name)

      expect(collection_names).to include('lottie_files')
    end

    it 'is not registered for scrolled entries without the feature' do
      entry = create(:published_entry, type_name: 'scrolled')

      collection_names = Pageflow.config_for(entry).file_types.map(&:collection_name)

      expect(collection_names).not_to include('lottie_files')
    end
  end

  Pageflow::Lint.file_type('lottie_file',
                           create_file_type: -> { PageflowScrolled.lottie_file_type },
                           create_file: -> { create(:lottie_file) })
end
