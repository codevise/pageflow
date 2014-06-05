module Dom
  module Admin
    class ThemingPage < Domino
      selector '.admin_themings'

      attribute :cname, '.attributes_table.pageflow_theming .cname td'
      attribute :imprint_label, '.attributes_table.pageflow_theming .imprint-label td'
      attribute :imprint_url, '.attributes_table.pageflow_theming .imprint-url td'
      attribute :copyright_label, '.attributes_table.pageflow_theming .copyright-label td'
      attribute :copyright_url, '.attributes_table.pageflow_theming .copyright-url td'

      def edit_link
        within(node) do
          find_link(I18n.t('active_admin.edit_model', model: I18n.t('activerecord.models.theming.one')))
        end
      end
    end
  end
end
