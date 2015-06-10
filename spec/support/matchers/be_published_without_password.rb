RSpec::Matchers.define :be_published_without_password do
  match do |entry|
    published_revision = entry.revisions.published.last
    published_revision && !published_revision.password_protected?
  end
end
