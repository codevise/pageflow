require 'spec_helper'

module Admin
  describe AccountsController do
    render_views

    it 'uses locale of signed in user' do
      sign_in(create(:user, :admin, locale: 'de'), scope: :user)
      get(:index)
      expect(response.body).to have_selector('html[lang=de]')
    end
  end
end
