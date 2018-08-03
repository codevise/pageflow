require 'spec_helper'

module Pageflow
  describe UrlTemplate do
    describe '.from_attachment' do
      def create_attachment(url:, filename: 'file.png')
        Class.new(ActiveRecord::Base) {
          self.table_name = 'pageflow_pages'

          has_attached_file(:thumbnail, url: url)
          attr_accessor(:thumbnail_file_name)

          def self.name
            'Page'
          end
        }.new(id: 5, thumbnail_file_name: filename).thumbnail
      end

      it 'returns url with :id_partition placeholder' do
        attachment = create_attachment(url: '/:class/:attachment/:id_partition/:style/:filename')

        result = UrlTemplate.from_attachment(attachment)

        expect(result).to eq('/pages/thumbnails/:id_partition/original/file.png')
      end

      it 'only replaces last set of digits' do
        attachment = create_attachment(url: '/123/:class/:id_partition/:style/:filename')

        result = UrlTemplate.from_attachment(attachment)

        expect(result).to eq('/123/pages/:id_partition/original/file.png')
      end

      it 'ignores other numeric values in url pattern' do
        attachment = create_attachment(url: '/_a123/_e1001/:class/:id_partition/:style/:filename')

        result = UrlTemplate.from_attachment(attachment)

        expect(result).to eq('/_a123/_e1001/pages/:id_partition/original/file.png')
      end

      it 'ignores numeric file names' do
        attachment = create_attachment(url: '/:class/:id_partition/:style/:filename',
                                       filename: '123')

        result = UrlTemplate.from_attachment(attachment)

        expect(result).to eq('/pages/:id_partition/original/123')
      end
    end
  end
end
