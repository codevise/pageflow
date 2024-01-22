module Pageflow
  # @api private
  module Translatable
    extend ActiveSupport::Concern

    included do
      belongs_to(:translation_group,
                 optional: true,
                 class_name: 'EntryTranslationGroup')

      has_many(:translations,
               through: :translation_group,
               source: :entries)

      after_destroy do
        if translation_group&.single_item_or_empty?
          translation_group.destroy
        elsif default_translation?
          translation_group.update(default_translation: nil)
        end
      end
    end

    def mark_as_translation_of(entry)
      transaction do
        ensure_translation_group(entry)

        if !entry.translation_group
          entry.update!(translation_group:)
        elsif entry.translation_group != translation_group
          entry.translation_group.merge_into(translation_group)
        end
      end
    end

    def remove_from_translation_group
      if translation_group.entries.count <= 2
        translation_group.destroy
      else
        translation_group.update(default_translation: nil) if default_translation?
        update!(translation_group: nil)
      end
    end

    def mark_as_default_translation
      translation_group.update!(default_translation: self)
    end

    def default_translation?
      translation_group&.default_translation == self
    end

    private

    def ensure_translation_group(other_entry)
      return if translation_group

      update!(translation_group: other_entry.translation_group ||
              build_translation_group(default_translation: self))
    end
  end
end
