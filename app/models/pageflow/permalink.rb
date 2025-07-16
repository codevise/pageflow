module Pageflow
  # @api private
  class Permalink < ApplicationRecord
    extend FriendlyId
    friendly_id :slug_candidates, use: :scoped, scope: :directory

    before_validation :set_default_slug

    has_one :entry

    belongs_to :directory, class_name: 'PermalinkDirectory'

    validates(:slug,
              format: {with: /\A[0-9a-zA-Z_-]+\z/, allow_blank: true},
              uniqueness: {scope: :directory})

    validate :belongs_to_same_site_as_entry

    before_update(:create_redirect,
                  if: lambda {
                        entry.first_published_at.present? && (slug_changed? || directory_changed?)
                      })

    attr_accessor :allow_root_path

    private

    def set_default_slug
      return unless slug == ''
      return if allow_emtpy_slug?

      self.slug = entry.default_permalink_slug
    end

    def allow_emtpy_slug?
      allow_root_path && directory&.path&.blank?
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
