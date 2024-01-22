module Pageflow
  # @api private
  class EntryTranslationGroup < ApplicationRecord
    has_many :entries,
             -> { order('title ASC') },
             foreign_key: 'translation_group_id',
             dependent: :nullify

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
