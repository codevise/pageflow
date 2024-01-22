module Pageflow
  module Admin
    # @api private
    module EntryTranslationsHelper
      def entry_translation_display_locale(entry)
        display_locale = t(
          'pageflow.public._language',
          locale: (entry.published_revision || entry.draft).locale
        )

        if entry.default_translation?
          t('pageflow.admin.entry_translations.default_translation', display_locale:)
        else
          display_locale
        end
      end
    end
  end
end
