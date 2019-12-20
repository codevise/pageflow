RSpec::Matchers.define :have_json_ld do |expected_attributes|
  match do |html|
    expect(json_ld_objects(html)).to include(a_hash_including(expected_attributes))
  end

  failure_message do |html|
    "expected\n\n#{JSON.pretty_generate(json_ld_objects(html))}\n\n" \
      "to contain a JSON-LD object with attributes\n\n#{JSON.pretty_generate(expected_attributes)}"
  end

  def json_ld_objects(html)
    Capybara
      .string(html)
      .all('script[type="application/ld+json"]', visible: false)
      .map { |element| JSON.parse(element.text(:all)) }
  end
end
