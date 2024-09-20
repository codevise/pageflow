module Pageflow
  # @api private
  class Permalink < ApplicationRecord
    extend FriendlyId
    friendly_id :slug_candidates, use: :scoped, scope: :directory

    before_validation :set_default_slug

    has_one :entry

    belongs_to :directory, class_name: 'PermalinkDirectory'

    validates(:slug,
              format: /\A[0-9a-zA-Z_-]+\z/,
              uniqueness: {scope: :directory})

    validate :belongs_to_same_site_as_entry

    before_update(:create_redirect,
                  if: -> { entry.first_published_at.present? && (slug_changed? || directory_changed?) })

    private

    def set_default_slug
      self.slug = entry.default_permalink_slug if slug == ''
    end

    def slug_candidates
      [entry.title, "#{entry.title}-#{entry.id}"]
    end

    def should_generate_new_friendly_id?
      slug.nil?
    end

    def belongs_to_same_site_as_entry
      return if !directory || !entry || entry.site_id == directory.site_id

      errors.add(:directory, :invalid)
    end

    def create_redirect
      directory.redirects.where(slug:).delete_all
      entry.permalink_redirects.create!(slug: slug_was,
                                        directory_id: directory_id_was)
    end
  end
end
