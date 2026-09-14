require 'spec_helper'

module PageflowScrolled
  fixture = JSON.parse(
    File.read(File.expand_path('../fixtures/file_references.json', __dir__))
  )

  RSpec.describe FileReferences do
    fixture['cases'].each do |test_case|
      it(test_case['name']) do
        references = FileReferences.new(test_case['locations'])
                                   .for(test_case['configuration'])

        expect(references.map { |reference| comparable(reference) })
          .to eq(test_case['references'])
      end
    end

    def comparable(reference)
      reference
        .merge(path: reference[:path].map(&:to_s))
        .transform_keys { |key| key.to_s.camelize(:lower) }
    end
  end
end
