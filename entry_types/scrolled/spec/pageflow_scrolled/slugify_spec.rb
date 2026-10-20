require 'spec_helper'

module PageflowScrolled
  RSpec.describe Slugify do
    cases = JSON.parse(File.read(Engine.root.join('package', 'spec', 'fixtures', 'slugify.json')))

    cases.each do |test_case|
      it "turns #{test_case['title'].inspect} into #{test_case['slug'].inspect}" do
        expect(Slugify.call(test_case['title'])).to eq(test_case['slug'])
      end
    end
  end
end
