module Dom
  module Admin
    class SitePage < Domino
      selector '.admin_sites'

      attribute :host, '.attributes_table.pageflow_site .host td'
      attribute :theme, '.attributes_table.pageflow_entry_template .theme td'

      attribute :default_author,
                '.attributes_table.pageflow_entry_template .default_author td'
      attribute :default_publisher,
                '.attributes_table.pageflow_entry_template .default_publisher td'
      attribute :default_keywords,
                '.attributes_table.pageflow_entry_template .default_keywords td'

      def edit_link
        within(node) do
          find_link(I18n.t('active_admin.edit_model',
                           model: I18n.t('activerecord.models.site.one')))
        end
      end
    end
  end
end
