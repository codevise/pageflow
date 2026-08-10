module Pageflow
  # Store per locale overrides for a set of attributes in an
  # `attribute_translations` column. The attribute itself keeps holding
  # the value used for locales without translation. Since that value is
  # read via the attribute's reader, overriding the reader also changes
  # the value locales without translation fall back to.
  #
  # Not to be confused with {Translatable}, which groups entries that
  # are translations of each other.
  #
  # @api private
  module TranslatedAttributes
    extend ActiveSupport::Concern

    included do
      class_attribute :translated_attribute_names, default: []

      serialize :attribute_translations, coder: JSON

      validate :attribute_translations_are_known_locales_and_attributes
    end

    module ClassMethods # rubocop:todo Style/Documentation
      # Declare which attributes can be overridden per locale. Defines
      # a `<name>_translations` reader and writer for each of them,
      # mapping locales to values.
      def translated_attributes(*names)
        self.translated_attribute_names = names.map(&:to_s)

        names.each do |name|
          define_method(:"#{name}_translations") { translations_for(name) }

          define_method(:"#{name}_translations=") do |translations|
            assign_translations(name, translations)
          end
        end
      end
    end

    def attribute_translations
      self[:attribute_translations] || {}
    end

    # Returns the translation for the given locale, or the value of the
    # attribute itself if there is none. The fallback goes through the
    # attribute's reader, so models can override it to compute a
    # default. Such an override must not call `translated` itself, since
    # that would recurse.
    def translated(attribute, locale:)
      locale_chain(locale)
        .lazy
        .map { |candidate| attribute_translations.dig(candidate, attribute.to_s) }
        .find(&:present?) || public_send(attribute)
    end

    private

    def translations_for(attribute)
      attribute_translations.each_with_object({}) do |(locale, values), result|
        value = values[attribute.to_s]
        result[locale] = value if value.present?
      end
    end

    # Translations of other attributes are preserved, while the given
    # translations replace all translations previously stored for this
    # attribute. Removing a translation in a form therefore does not
    # require sending a separate delete instruction.
    def assign_translations(attribute, translations)
      result = attribute_translations.deep_dup
      result.each_value { |values| values.delete(attribute.to_s) }

      translations.each do |locale, value|
        next if value.blank?

        (result[locale.to_s] ||= {})[attribute.to_s] = value
      end

      self[:attribute_translations] = result.reject { |_locale, values| values.empty? }
    end

    # Regional locales fall back to their base locale, matching how
    # translations are looked up for the entry's locale elsewhere.
    def locale_chain(locale)
      [locale.to_s, locale.to_s.split('-').first].uniq
    end

    def attribute_translations_are_known_locales_and_attributes
      available_locales = Pageflow.config.available_public_locales.map(&:to_s)

      attribute_translations.each do |locale, values|
        unless available_locales.include?(locale)
          errors.add(:attribute_translations, :unknown_locale)
        end

        unknown = values.keys - translated_attribute_names
        errors.add(:attribute_translations, :not_translatable) if unknown.any?
      end
    end
  end
end
