class ResetCopiedSnapshotType < ActiveRecord::Migration
  def up
    fix_restored_drafts
    fix_publications_created_from_restored_drafts
  end

  private

  def fix_restored_drafts
    execute(<<-SQL)
      UPDATE pageflow_revisions
        SET snapshot_type = NULL
        WHERE frozen_at IS NULL;
    SQL
  end

  def fix_publications_created_from_restored_drafts
    execute(<<-SQL)
      UPDATE pageflow_revisions
        SET snapshot_type = NULL
        WHERE published_at IS NOT NULL;
    SQL
  end
end
