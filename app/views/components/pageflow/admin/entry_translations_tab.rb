module Pageflow
  module Admin
    # @api private
    class EntryTranslationsTab < ViewComponent
      def build(entry)
        default_translation_hint(entry)

        embedded_index_table(
          entry.translations.preload(:draft, :published_revision, :translation_group),
          blank_slate_text: I18n.t('pageflow.admin.entry_translations.no_translations')
        ) do
          table_for_collection i18n: Entry do
            column class: 'publication_state' do |translated_entry|
              entry_publication_state_indicator(translated_entry)
            end
            column :title do |translated_entry|
              entry_link_or_title(entry, translated_entry)
            end
            column :locale do |translated_entry|
              entry_translation_display_locale(translated_entry)
            end
            column do |translated_entry|
              mark_as_default_link(entry, translated_entry)
            end
            column do |translated_entry|
              remove_link(entry, translated_entry)
            end
          end
        end

        add_link(entry)
        generate_link(entry)
      end

      private

      def default_translation_hint(entry)
        return if entry.translations.none?

        div class: 'side_hint' do
          para text_node I18n.t('pageflow.admin.entry_translations.default_translation_hint')
        end
      end

      def entry_link_or_title(entry, translated_entry)
        if authorized?(:read, translated_entry) && translated_entry != entry
          link_to(translated_entry.title,
                  admin_entry_path(translated_entry, tab: 'translations'))
        else
          translated_entry.title
        end
      end

      def mark_as_default_link(entry, translated_entry)
        return unless authorized?(:manage_translations, entry)
        return if translated_entry.default_translation?

        link_to(
          I18n.t('pageflow.admin.entry_translations.mark_as_default'),
          default_admin_entry_translation_path(entry, translated_entry),
          method: :put,
          data: {
            confirm: I18n.t('pageflow.admin.entry_translations.mark_as_default_confirmation')
          }
        )
      end

      def remove_link(entry, translated_entry)
        return unless authorized?(:manage_translations, entry)

        link_to(
          I18n.t('pageflow.admin.entry_translations.remove'),
          admin_entry_translation_path(entry, translated_entry),
          method: :delete,
          data: {
            confirm: I18n.t('pageflow.admin.entry_translations.remove_confirmation')
          }
        )
      end

      def add_link(entry)
        return unless authorized?(:manage_translations, entry)

        text_node(link_to(t('pageflow.admin.entry_translations.add'),
                          new_admin_entry_translation_path(entry),
                          class: 'button'))
      end

      def generate_link(entry)
        return unless authorized?(:manage_translations, entry)

        entry_translator_url = Pageflow.config_for(entry).entry_translator_url
        return if entry_translator_url.blank?

        text_node(link_to(t('pageflow.admin.entry_translations.generate'),
                          entry_translator_url.call(entry),
                          class: 'button',
                          style: 'margin-left: 8px'))
      end
    end
  end
end
