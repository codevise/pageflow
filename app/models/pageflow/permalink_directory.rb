module Pageflow
  # @api private
  class PermalinkDirectory < ApplicationRecord
    belongs_to :site

    validates(:path,
              format: %r{\A([0-9a-zA-Z-]+/)*\z},
              uniqueness: {scope: :site_id})

    has_many(:permalinks,
             foreign_key: :directory_id)

    has_many(:redirects,
             class_name: 'PermalinkRedirect',
             foreign_key: :directory_id)

    def first_available_slug(base_slug, except: nil)
      taken_slugs = permalinks
                    .where.not(id: except)
                    .where('slug = :base_slug OR slug LIKE :suffixed',
                           base_slug:,
                           suffixed: "#{self.class.sanitize_sql_like(base_slug)}-%")
                    .pluck(:slug)

      (1..)
        .lazy
        .map { |index| index == 1 ? base_slug : "#{base_slug}-#{index}" }
        .find { |slug| !taken_slugs.include?(slug) }
    end
  end
end
