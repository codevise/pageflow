module Pageflow
  module Admin
    # @api private
    class EntryCommentNotificationsDropdown < ActiveAdmin::Views::DropdownMenu
      builder_method :entry_comment_notifications_dropdown

      SCOPE = 'pageflow.admin.entries.comments.notifications'.freeze
      DOM_ID = 'comment_notifications'.freeze

      def build(entry, notifications, options = {})
        @entry = entry
        @notifications = notifications

        # Active Admin's initializer collapses the menu of anything
        # classed dropdown_menu, and passing a class here replaces the
        # one the component adds for itself.
        super(level_icon(notifications.level),
              id: DOM_ID,
              class: "dropdown_menu entry_comment_notifications #{notifications.level}",
              button: {'aria-label' => button_text, title: button_text})

        heading
        default_item
        CommentNotificationLevel::STORABLE_PER_ENTRY.each { |level| level_item(level) }
        open_on_load_script if options[:open]
      end

      private

      def open_on_load_script
        text_node(
          javascript_tag("jQuery(function($) { $('##{DOM_ID}').aaDropdownMenu('open'); });")
        )
      end

      # The button is only a bell, so the menu is the one place that
      # says which notifications these levels are about.
      def heading
        within @menu do
          li(I18n.t("#{SCOPE}.heading"), class: 'heading')
        end
      end

      def button_text
        I18n.t("#{SCOPE}.button",
               level: I18n.t("#{SCOPE}.levels.#{@notifications.level}"))
      end

      def default_item
        add_item(nil,
                 I18n.t("#{SCOPE}.default.name",
                        level: I18n.t("#{SCOPE}.levels.#{@notifications.default_level}")),
                 I18n.t("#{SCOPE}.default.#{@notifications.bucket}"))
      end

      def level_item(level)
        add_item(level,
                 I18n.t("#{SCOPE}.levels.#{level}"),
                 I18n.t("#{SCOPE}.hints.#{level}"))
      end

      def add_item(level, name, hint)
        options = {method: :patch}
        options[:aria] = {current: true} if @notifications.override_level == level

        item(item_label(level || @notifications.default_level, name, hint),
             comment_notification_level_admin_entry_path(@entry, level:),
             **options)
      end

      def item_label(level, name, hint)
        safe_join([level_icon(level),
                   content_tag(:span, name, class: 'name'),
                   content_tag(:span, hint, class: 'hint')])
      end

      def level_icon(level)
        content_tag(:span, '', class: "comment_notification_level #{level}")
      end
    end
  end
end
