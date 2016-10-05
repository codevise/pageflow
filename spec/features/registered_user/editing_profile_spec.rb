require 'spec_helper'

feature 'as registered user, editing own profile' do
  scenario 'change first and last name', focus: true do
    create(:user, email: 'john@example.com', password: '@qwert12345')

    Dom::Admin::Page.sign_in(email: 'john@example.com', password: '@qwert12345')
    visit('/admin/users/me')
    Dom::Admin::ProfileForm.first.submit_with(first_name: 'Joe', last_name: 'Johnson')
    visit('/admin/users/me')
    form = Dom::Admin::ProfileForm.first

    expect(form.first_name).to eq('Joe')
    expect(form.last_name).to eq('Johnson')
  end

  scenario 'change password' do
    create(:user, email: 'john@example.com', password: '@qwert12345')

    Dom::Admin::Page.sign_in(email: 'john@example.com', password: '@qwert12345')
    visit('/admin/users/me')
    Dom::Admin::ProfileForm.first.submit_with(current_password: '@qwert12345',
                                              password: '@new12345',
                                              password_confirmation: '@new12345')

    expect(Dom::Admin::Page).to be_accessible_with(email: 'john@example.com', password: '@new12345')
  end
end
