module Pageflow
  # Seed data that is used for published entires as well as editor
  # display.
  #
  # @api private
  module CommonEntrySeedHelper
    include ConfigHelper

    def common_entry_seed(json, entry)
      config = Pageflow.config_for(entry)

      json.locale entry.locale
      json.theming entry.theming.as_json(only: [:privacy_link_url])
      json.enabled_feature_names entry.enabled_feature_names
      json.page_types PageTypesSeed.new(config).as_json

      json.file_url_templates { config_file_url_templates_seed(json, config) }
      json.file_model_types { config_file_model_types_seed(json, config) }
    end

    class PageTypesSeed
      attr_reader :config

      def initialize(config)
        @config = config
      end

      def as_json
        config.page_types.each_with_object({}) do |page_type, result|
          result[page_type.name.to_sym] = page_type_seed(page_type)
        end
      end

      private

      def page_type_seed(page_type)
        {
          thumbnail_candidates: thumbnail_candidates(page_type)
        }
      end

      def thumbnail_candidates(page_type)
        page_type.thumbnail_candidates.map do |candidate|
          {
            attribute: candidate[:attribute],
            collection_name: candidate[:file_collection],
            css_class_prefix: thumbnail_candidate_css_class_prefix(candidate),
            condition: condition(candidate)
          }
        end
      end

      def thumbnail_candidate_css_class_prefix(candidate)
        file_type = config.file_types.find_by_collection_name!(candidate[:file_collection])
        file_type.model.model_name.singular
      end

      def condition(candidate)
        result = candidate[:unless] || candidate[:if]

        if result
          result[:negated] = !!candidate[:unless]
        end

        result
      end
    end
  end
end
