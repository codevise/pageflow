require 'spec_helper'

module Pageflow
  describe Admin::Timestamp, type: :view_component do
    it 'renders only time if today' do
      Timecop.freeze(Time.local(2022, 5, 9, 15, 58)) do
        render(Time.now)
      end

      expect(rendered).to have_selector('.tooltip_clue', text: /Today, 15:58/)
      expect(rendered).to have_selector('.tooltip_bubble', text: /May 09, 2022 15:58/)
    end

    it 'renders only date if not today' do
      Timecop.freeze(Time.local(2022, 5, 9, 15, 58)) do
        render(Time.now + 1.day)
      end

      expect(rendered).to have_selector('.tooltip_clue', text: /2022-05-10/)
      expect(rendered).to have_selector('.tooltip_bubble', text: /May 10, 2022 15:58/)
    end

    it 'renders nothing when nil is passed' do
      render(nil)

      expect(ActionController::Base.helpers.strip_tags(rendered).strip).to eq('')
    end
  end
end
