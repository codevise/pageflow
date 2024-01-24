module Pageflow
  # @api private
  class PotentialEntryTranslations
    def initialize(entry)
      @entry = entry
    end

    def self.for(entry)
      new(entry)
    end

    def resolve
      preload(
        group_by_translation_group(
          exclude_translations(
            other_entries_of_account
          )
        )
      )
    end

    private

    def other_entries_of_account
      @entry.account.entries.where.not(id: @entry.id)
    end

    def exclude_translations(scope)
      return scope unless @entry.translation_group

      scope
        .where.not(translation_group_id: @entry.translation_group)
        .or(scope.where(translation_group: nil))
    end

    def group_by_translation_group(scope)
      scope
        # Use MIN(id) to choose an arbitrary entry to represent its
        # translation group. MIN(translation_group_id) is needed since
        # technically translation_group_id is not part of the GROUP BY
        # clause.
        .select(<<-SQL)
          MIN(id) as id,
          GROUP_CONCAT(title) as title,
          MIN(translation_group_id) as translation_group_id
        SQL
        .group('IFNULL(translation_group_id, id)')
        .order('title ASC')
    end

    def preload(scope)
      scope.includes(translation_group: :entries)
    end
  end
end
