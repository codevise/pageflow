module Pageflow
  # @api private
  class CommentThread < ApplicationRecord
    include RevisionComponent

    serialize :subject_range, coder: JSON

    belongs_to :creator, class_name: 'User'
    belongs_to :resolver, class_name: 'User', foreign_key: :resolved_by_id, optional: true
    has_many :comments, dependent: :destroy

    nested_revision_components :comments

    validates :subject_type, :subject_id, presence: true

    def resolve(user)
      update!(resolved_at: Time.current, resolver: user) unless resolved_at
    end

    def unresolve
      update!(resolved_at: nil, resolver: nil)
    end

    def self.update_subject_ranges_for(revision:, subject_type:, subject_id:, ranges:)
      return if ranges.blank?

      where(revision_id: revision.id,
            subject_type:, subject_id:,
            id: ranges.keys).update_all(
              sanitize_sql_array(
                ["subject_range = #{subject_range_case_sql(ranges)}, updated_at = ?",
                 Time.current]
              )
            )
    end

    def self.subject_range_case_sql(ranges)
      when_clauses = ranges.map do |id, range|
        sanitize_sql_array(['WHEN ? THEN ?', id.to_i, range.to_json])
      end
      "CASE id #{when_clauses.join(' ')} END"
    end
    private_class_method :subject_range_case_sql
  end
end
