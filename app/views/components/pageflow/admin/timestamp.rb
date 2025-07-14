module Pageflow
  module Admin
    class Timestamp < ViewComponent
      builder_method :timestamp

      def build(time)
        return unless time

        span class: 'tooltip_clue' do
          text_node(l(time, format: time.today? ? :time_today : :date))
          span(l(time, format: :long), class: 'tooltip_bubble')
        end
      end

      def tag_name
        'span'
      end
    end
  end
end
