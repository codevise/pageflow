require 'uri'

RSpec::Matchers.define :be_relative_url do
  match do |url|
    begin
      uri = URI.parse(url)
      uri.host.nil? && !uri.path.start_with?('/')
    rescue URI::InvalidURIError
      false
    end
  end
end

RSpec::Matchers.alias_matcher :a_relative_url, :be_relative_url
