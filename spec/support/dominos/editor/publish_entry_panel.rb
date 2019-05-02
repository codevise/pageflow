module Dom
  module Editor
    class PublishEntryPanel < Domino
      selector 'div.publish_entry'

      attribute :exhausted_message, '.exhausted_message'

      def save_button
        node.find('button.save')
      end

      def publish
        activate_publish_forever
        save_button.click
        wait_for_save_to_finish
      end

      def set_depublication_date(date, time)
        node.find('input[name=publish_until]').set(date)
        node.find('input[name=publish_until_time]').set(time)

        # capybara doesn't hide the datepicker overlay properly
        blur_input_fields
      end

      def save
        save_button.click
        wait_for_save_to_finish
      end

      def publish_until(date)
        activate_publish_until
        set_depublication_date(date.strftime('%d.%m.%Y'), date.strftime('%H:%M'))
        save
      end

      def activate_password_protection(password)
        node.find('input[name=password_protected]').click
        node.find('input[name=password]').set(password)
      end

      def activate_publish_forever
        node.find('#publish_entry_forever').click
      end

      def activate_publish_until
        node.find('#publish_entry_until').click
      end

      private

      def wait_for_save_to_finish
        node.has_selector?('.publish_entry.published')
      end

      def blur_input_fields
        node.find('h2').click
        # Wait for date drop down to fade out
        sleep 1
      end
    end
  end
end
