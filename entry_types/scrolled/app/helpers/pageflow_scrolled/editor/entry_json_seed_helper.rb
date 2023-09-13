module PageflowScrolled
  module Editor
    # Render editor seed data for scrolled entries.
    #
    # @api private
    module EntryJsonSeedHelper
      include PageflowScrolled::EntryJsonSeedHelper

      def scrolled_entry_editor_json_seed(json, scrolled_entry)
        json.key_format!(camelize: :lower)
        scrolled_entry_editor_legacy_typography_variants_seed(json, scrolled_entry)

        scrolled_entry_json_seed(json,
                                 scrolled_entry,
                                 skip_files: true,
                                 skip_i18n: true,
                                 include_unused_additional_seed_data: true)
      end

      private

      def scrolled_entry_editor_legacy_typography_variants_seed(json, scrolled_entry)
        json.legacy_typography_variants(
          Pageflow
            .config_for(scrolled_entry)
            .legacy_typography_variants
            .deep_transform_keys { |key| key.to_s.camelize(:lower) }
        )
      end
    end
  end
end
