module Pageflow
  # @api private
  module HelpEntriesHelper
    def help_entry_sections(config)
      render(partial: 'pageflow/help_entries/section',
             collection: config.help_entries.flat,
             as: :help_entry)
    end

    def help_entries_menu(config)
      render('pageflow/help_entries/menu', help_entries: config.help_entries)
    end

    def help_entry_li(help_entry, &)
      css_class = help_entry.children.present? ? 'expandable' : nil
      content_tag(:li, class: css_class, &)
    end
  end
end
