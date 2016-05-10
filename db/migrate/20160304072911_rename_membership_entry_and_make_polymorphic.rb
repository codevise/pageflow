class RenameMembershipEntryAndMakePolymorphic < ActiveRecord::Migration
  def change
    rename_column :pageflow_memberships, :entry_id, :entity_id
    add_column :pageflow_memberships, :entity_type, :string
    reversible do |dir|
      dir.up do
        update_each_membership_to_reference_an_entity_of_type_entry
      end
    end
  end

  private

  def update_each_membership_to_reference_an_entity_of_type_entry
    execute(<<-SQL)
      UPDATE pageflow_memberships SET entity_type = 'Pageflow::Entry'
    SQL
  end
end
