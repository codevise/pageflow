module Pageflow
  class FeedEntriesQuery < ApplicationQuery
    class Scope < Scope
      attr_reader :scope, :page

      def initialize(scope, page)
        @scope = scope
        @page = page
      end

      def resolve
        scope \
          .published_without_password_protection
          .order(updated_at: :desc)
          .page page
      end
    end
  end
end
