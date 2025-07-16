module Pageflow
  # @api private
  class UserNameQuery < ApplicationQuery
    class Scope < Scope # rubocop:todo Style/Documentation
      def initialize(term, scope)
        @term = term
        @scope = scope
      end

      def resolve
        scope.where(word_conditions(term))
      end

      private

      attr_reader :term, :scope

      def word_conditions(term)
        term.split(' ').map { |word|
          word_condition(word)
        }.join(' AND ')
      end

      def word_condition(word)
        sanitize_sql('(users.first_name LIKE :word OR users.last_name LIKE :word)',
                     word: "%#{word}%")
      end
    end
  end
end
