module PageflowScrolled
  module EntryStructuredDataTypes
    # Generates Schema.org FAQPage structured data from question content elements
    class FaqPage
      def initialize(content_element_type_names: ['question'])
        @content_element_type_names = content_element_type_names
      end

      def call(entry)
        content_elements = PageflowScrolled::ContentElement
                           .all_for_revision(entry.revision)
                           .where(type_name: @content_element_type_names)

        main_entity = content_elements.map { |element|
          question_text = extract_text(element.configuration['question'])
          answer_text = extract_text(element.configuration['answer'])

          next if question_text.blank? || answer_text.blank?

          {
            '@type' => 'Question',
            'name' => question_text,
            'acceptedAnswer' => {
              '@type' => 'Answer',
              'text' => answer_text
            }
          }
        }.compact

        {
          '@type' => 'FAQPage',
          'mainEntity' => main_entity
        }
      end

      private

      def extract_text(slate_json)
        return '' if slate_json.blank?

        texts = []
        collect_text(slate_json, texts)
        texts.join.strip
      end

      def collect_text(nodes, texts)
        return unless nodes.is_a?(Array)

        nodes.each do |node|
          if node.is_a?(Hash)
            texts << node['text'] if node['text']
            collect_text(node['children'], texts) if node['children']
          end
        end
      end
    end
  end
end
