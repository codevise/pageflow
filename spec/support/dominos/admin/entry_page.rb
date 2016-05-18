module Dom
  module Admin
    class EntryPage < Domino
      selector '.admin_entries'

      attribute :title, '.attributes_table.pageflow_entry .title td'
      attribute :account, '.attributes_table.pageflow_entry .account td'
      attribute :membership, '.entry_members tbody .user a'

      def published?
        node.has_selector?('[data-published=true]')
      end

      def add_entry_link
        within(node) do
          find_link(I18n.t('active_admin.new_model',
                           model: I18n.t('activerecord.models.entry.one')))
        end
      end

      def edit_entry_link
        within(node) do
          find_link(I18n.t('active_admin.edit_model',
                           model: I18n.t('activerecord.models.entry.one')))
        end
      end

      def add_member_link
        within(node) do
          find('[data-rel=add_member]')
        end
      end

      def edit_role_link(role)
        within(node) do
          find("[data-rel=edit_entry_membership_#{role}]")
        end
      end

      def delete_entry_link
        within(node) do
          find_link(I18n.t('active_admin.delete_model',
                           model: I18n.t('activerecord.models.entry.one')))
        end
      end

      def delete_member_link(role)
        within(node) do
          find("[data-rel=delete_membership_#{role}]")
        end
      end

      def depublish_button
        within(node) do
          find('[data-rel=depublish]')
        end
      end

      def duplicate_button
        within(node) do
          find('[data-rel=duplicate]')
        end
      end

      def self.visit_revisions(entry)
        url_helpers = Rails.application.routes.url_helpers
        visit(url_helpers.admin_entry_path(entry, tab: 'revisions'))
      end

      def has_role_flag?(role)
        within(node) do
          has_selector?(".memberships .#{role}")
        end
      end
    end
  end
end
