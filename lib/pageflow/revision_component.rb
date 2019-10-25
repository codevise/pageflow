module Pageflow
  # RevisionComponent represents a model that is attached to the revision
  # mechanism of Pageflow.
  #
  # In order to be used as a ComponentModel a model is required to
  # have an integer field `perma_id` and a belongs_to field `revision`.
  module RevisionComponent
    extend ActiveSupport::Concern

    ADVISORY_LOCK_TIMEOUT_SECONDS = 5

    class PermaIdGenerationAdvisoryLockTimeout < StandardError; end

    included do
      belongs_to :revision, class_name: 'Pageflow::Revision'
      before_save :ensure_perma_id
    end

    def copy_to(revision)
      record = dup
      record.revision = revision
      record.save!
    end

    def ensure_perma_id
      self.perma_id ||= (self.class.maximum(:perma_id) || 0) + 1
    end

    def save(*)
      with_advisory_lock_for_perma_id_generation! do
        super
      end
    end

    def save!(*)
      with_advisory_lock_for_perma_id_generation! do
        super
      end
    end

    private

    def with_advisory_lock_for_perma_id_generation!(&block)
      return yield if perma_id.present?

      r = with_advisory_lock_result_for_perma_id_generation(&block)
      raise(PermaIdGenerationAdvisoryLockTimeout) unless r.lock_was_acquired?

      r.result
    end

    def with_advisory_lock_result_for_perma_id_generation(&block)
      self.class.with_advisory_lock_result("#{self.class.table_name}_perma_id",
                                           timeout_seconds: ADVISORY_LOCK_TIMEOUT_SECONDS,
                                           &block)
    end

    module ClassMethods
      def all_for_revision(revision)
        where(revision_id: revision.id)
      end

      def from_perma_ids(revision, perma_ids)
        return [] if revision.blank? || perma_ids.blank?

        perma_ids.map do |perma_id|
          find_by_revision_id_and_perma_id(revision.id, perma_id)
        end.compact
      end
    end
  end
end
