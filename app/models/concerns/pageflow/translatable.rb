module Pageflow
  # @api private
  module Translatable
    extend ActiveSupport::Concern

    included do
      belongs_to :translation_group,
                 optional: true,
                 class_name: 'EntryTranslationGroup'

      has_many :translations,
               ->(entry) { excluding(entry) },
               through: :translation_group,
               source: :entries

      after_destroy do
        translation_group.destroy if translation_group&.single_item_or_empty?
      end
    end

    def mark_as_translation_of(entry)
      transaction do
        unless translation_group
          update!(translation_group: entry.translation_group || build_translation_group)
        end

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
        update!(translation_group: nil)
      end
    end
  end
end
