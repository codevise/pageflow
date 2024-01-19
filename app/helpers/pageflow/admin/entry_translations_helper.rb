module Pageflow
  module Admin
    # @api private
    module EntryTranslationsHelper
      def entry_translation_display_locale(entry)
        I18n.t(
          'pageflow.public._language',
          locale: (entry.published_revision || entry.draft).locale
        )
      end
    end
  end
end
