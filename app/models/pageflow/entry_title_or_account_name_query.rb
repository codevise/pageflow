module Pageflow
  # @api private
  class EntryTitleOrAccountNameQuery < ApplicationQuery
    class Scope < Scope # rubocop:todo Style/Documentation
      def initialize(term, scope)
        @term = term
        @scope = scope
      end

      def resolve
        scope
          .joins(:account)
          .references(:pageflow_accounts)
          .where(word_conditions(term))
      end

      private

      attr_reader :term, :scope

      def word_conditions(term)
        term.split(' ').map { |word|
          word_condition(word)
        }.join(' AND ')
      end

      def word_condition(word)
        sanitize_sql('(pageflow_entries.title LIKE :word OR pageflow_accounts.name LIKE :word)',
                     word: "%#{word}%")
      end
    end
  end
end
