RSpec::Matchers.define :be_published_with_password do |password|
  match do |entry|
    published_revision = entry.revisions.published.last

    published_revision&.password_protected? &&
      entry.authenticate(password) == entry
  end
end
