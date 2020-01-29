module Pageflow
  # Generate seed data based on configuration objects
  module ConfigHelper
    # Render seed data that can be used to build file urls.
    #
    # @param [JBuilder] json
    # @param [Configuration] config
    # @since 15.1
    def config_file_url_templates_seed(json, config)
      config.file_types.each do |file_type|
        json.set!(file_type.collection_name) do
          file_type.url_templates.call.each do |key, value|
            json.set!(key, value)
          end
        end
      end
    end

    # Render seed data that can be used to map model names in
    # parent_file_model_type attributes to file collection names.
    #
    # @param [JBuilder] json
    # @param [Configuration] config
    # @since 15.1
    def config_file_model_types_seed(json, config)
      config.file_types.index_by(&:collection_name).each do |collection_name, file_type|
        json.set!(collection_name, file_type.model.name)
      end
    end

    # Render seed data that can be used to display legal information.
    #
    # @param [JBuilder] json
    # @param [Entry] entry
    # @since edge
    def config_imprint_and_privacy_seed(json, entry)
      theming = entry.theming
      json.imprint do
        json.imprint_link_label theming.imprint_link_label
        json.imprint_link_url theming.imprint_link_url
      end
      json.copyright do
        json.copyright_link_label raw(theming.copyright_link_label)
        json.copyright_link_url theming.copyright_link_url
      end
      json.privacy do
        json.privacy_link_label I18n.t('pageflow.public.privacy_notice')
        json.privacy_link_url "#{theming.privacy_link_url}?lang=#{entry.locale}"
      end
    end
  end
end
