module Pageflow
  # @api private
  class EntryTranslationGroup < ApplicationRecord
    has_many :entries,
             -> { order(title: :asc) },
             foreign_key: 'translation_group_id',
             dependent: :nullify

    has_many :publicly_visible_entries,
             -> { published_without_password_protection.published_without_noindex },
             foreign_key: 'translation_group_id',
             class_name: 'Entry'

    belongs_to :default_translation,
               class_name: 'Entry',
               optional: true

    def merge_into(translation_group)
      entries.update_all(translation_group_id: translation_group.id)
      destroy
    end

    def single_item_or_empty?
      !entries.many?
    end
  end
end
