module Pageflow
  module Admin
    # @api private
    class EntryTranslationsTab < ViewComponent
      def build(entry)
        embedded_index_table(
          entry.translations.preload(:draft, :published_revision, :translation_group),
          blank_slate_text: I18n.t('pageflow.admin.entry_translations.no_translations')
        ) do
          table_for_collection i18n: Entry do
            column class: 'publication_state' do |translated_entry|
              entry_publication_state_indicator(translated_entry)
            end
            column :title do |translated_entry|
              entry_link_or_title(translated_entry)
            end
            column :locale do |translated_entry|
              entry_translation_display_locale(translated_entry)
            end
            column do |translated_entry|
              remove_link(entry, translated_entry)
            end
          end
        end

        add_link(entry)
      end

      private

      def entry_link_or_title(translated_entry)
        if authorized?(:read, translated_entry)
          link_to(translated_entry.title,
                  admin_entry_path(translated_entry, tab: 'translations'))
        else
          translated_entry.title
        end
      end

      def remove_link(entry, translated_entry)
        return unless authorized?(:manage_translations, entry)

        link_to(I18n.t('pageflow.admin.entries.remove'),
                admin_entry_translation_path(entry, translated_entry),
                method: :delete,
                data: {
                  confirm: I18n.t('pageflow.admin.entry_translations.delete_confirmation')
                })
      end

      def add_link(entry)
        return unless authorized?(:manage_translations, entry)

        text_node(link_to(t('pageflow.admin.entry_translations.add'),
                          new_admin_entry_translation_path(entry),
                          class: 'button'))
      end
    end
  end
end
