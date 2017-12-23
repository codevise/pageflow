module Pageflow
  class EntryFeed < ApplicationQuery
    class Scope < Scope
      attr_reader :scope, :page

      def initialize(scope, page=nil)
        @scope = scope
        @page = page
      end

      def entries
        scope \
          .includes(:published_revision)
          .published_without_password_protection
          .order("pageflow_revisions.published_at DESC")
          .page page
      end
    end
  end
end
