RSpec::Matchers.define :include_record_with do |attributes|
  match do |records|
    records.detect do |record|
      record.attributes.slice(*attributes.stringify_keys.keys) == attributes.stringify_keys
    end
  end
end
