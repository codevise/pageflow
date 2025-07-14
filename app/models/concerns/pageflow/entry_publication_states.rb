module Pageflow
  module EntryPublicationStates
    extend ActiveSupport::Concern

    included do
      scope(:published, -> { joins(:published_revision) })

      scope(:published_without_password_protection,
            -> { published.merge(Revision.without_password_protection) })

      scope(:published_with_password_protection,
            -> { published.merge(Revision.with_password_protection) })

      scope(:published_without_noindex,
            -> { published.merge(Revision.without_noindex) })

      scope(:not_published,
            lambda do
              includes(:published_revision)
                .references(:pageflow_revisions)
                .where(pageflow_revisions: {id: nil})
            end)
    end

    def publication_state
      if published_with_password_protection?
        'published_with_password_protection'
      elsif published? && published_revision.noindex?
        'published_with_noindex'
      elsif published?
        'published_without_password_protection'
      else
        'not_published'
      end
    end

    def published_with_password_protection?
      published? && published_revision.password_protected?
    end

    def published_without_password_protection?
      published? && !published_revision.password_protected?
    end

    def published?
      published_revision.present?
    end

    def published_at
      published? ? published_revision.published_at : nil
    end

    def published_until
      published? ? published_revision.published_until : nil
    end

    def last_published_with_noindex?
      !!revisions.publications.first&.noindex
    end

    module ClassMethods
      def with_publication_state(state)
        case state
        when 'published_with_password_protection'
          published_with_password_protection
        when 'published_without_password_protection'
          published_without_password_protection
        when 'not_published'
          not_published
        else
          raise(ArgumentError, "Unknown publication state #{state}")
        end
      end
    end
  end
end
