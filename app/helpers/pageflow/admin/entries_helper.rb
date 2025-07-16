module Pageflow
  module Admin
    module EntriesHelper # rubocop:todo Style/Documentation
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

      def entry_type_collection(entry_types = Pageflow.config.entry_types)
        entry_types.map(&:name).index_by do |type|
          I18n.t(type, scope: 'activerecord.values.pageflow/entry.type_names')
        end
      end
    end
  end
end
