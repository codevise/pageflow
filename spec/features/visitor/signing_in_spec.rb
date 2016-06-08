require 'spec_helper'

feature 'as visitor, signing in' do
  scenario 'with email and password' do
    create :user, email: 'john@example.com', password: '@qwert12345'

    visit '/admin'
    Dom::Admin::SignInForm.first.submit_with(email: 'john@example.com', password: '@qwert12345')

    expect(Dom::Admin::Page.first).to have_signed_in_user
  end
end
