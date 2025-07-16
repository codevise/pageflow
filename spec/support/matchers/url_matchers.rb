require 'uri'

RSpec::Matchers.define :be_relative_url do
  match do |url|
    uri = URI.parse(url)
    uri.host.nil? && !uri.path.start_with?('/')
  rescue URI::InvalidURIError
    false
  end
end

RSpec::Matchers.alias_matcher :a_relative_url, :be_relative_url

RSpec::Matchers.define :be_absolute_url do
  match do |url|
    uri = URI.parse(url)
    uri.host.present? && uri.scheme.present?
  rescue URI::InvalidURIError
    false
  end
end

RSpec::Matchers.alias_matcher :an_absolute_url, :be_absolute_url
