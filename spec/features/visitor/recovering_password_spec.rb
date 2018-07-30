require 'spec_helper'

feature 'as visitor, recovering password' do
  scenario 'with email', perform_jobs: true do
    create(:user, email: 'john@example.com', password: '@qwert12345')

    visit('/admin')
    Dom::Admin::SignInForm.first.forgot_password_link.click
    Dom::Admin::RecoverPasswordForm.first.submit_with(email: 'john@example.com')
    visit(MailClient.of('john@example.com').receive_password_reset_link)
    Dom::Admin::NewPasswordForm.first.submit_with(password: '@new12345')

    expect(Dom::Admin::Page).to be_accessible_with(email: 'john@example.com', password: '@new12345')
  end
end
