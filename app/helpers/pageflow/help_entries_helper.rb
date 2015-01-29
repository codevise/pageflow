module Pageflow
  # @api private
  module HelpEntriesHelper
    def help_entry_sections
      render(partial: 'pageflow/help_entries/section',
             collection: Pageflow.config.help_entries.flat,
             as: :help_entry)
    end

    def help_entries_menu
      render('pageflow/help_entries/menu', help_entries: Pageflow.config.help_entries)
    end

    def help_entry_li(help_entry, &block)
      css_class = help_entry.children.present? ? 'expandable' : nil
      content_tag(:li, class: css_class, &block)
    end
  end
end
