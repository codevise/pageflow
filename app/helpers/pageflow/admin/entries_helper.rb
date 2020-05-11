module Pageflow
  module Admin
    module EntriesHelper
      def admin_entry_title(entry)
        if entry.title.blank?
          I18n.t('pageflow.admin.entries.default_title', id: entry.id)
        else
          entry.title
        end
      end

      def collection_for_entry_publication_states
        [
          'published_without_password_protection',
          'published_with_password_protection',
          'not_published'
        ].index_by do |state|
          I18n.t(state, scope: 'activerecord.values.pageflow/entry.publication_states')
        end
      end

      def entry_type_collection
        entry_type_collection_for_config(Pageflow.config)
      end

      def entry_type_collection_for_account(target)
        entry_type_collection_for_config(Pageflow.config_for(target))
      end

      private

      def entry_type_collection_for_config(config)
        config.entry_types.map(&:name).index_by do |type|
          I18n.t(type, scope: 'activerecord.values.pageflow/entry.type_names')
        end
      end
    end
  end
end
