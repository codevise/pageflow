module Pageflow
  class EntryFeed < ApplicationQuery
    class Scope < Scope
      attr_reader :scope, :page
      attr_accessor :per_page

      def initialize(scope, page=nil)
        @scope = scope
        @page = page
        @per_page = 25
      end

      def entries
        scope \
          .includes(:published_revision)
          .published_without_password_protection
          .order("pageflow_revisions.published_at DESC")
          .page(page).per(per_page)
      end
    end
  end
end
