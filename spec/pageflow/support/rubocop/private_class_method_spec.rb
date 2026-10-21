require 'rubocop'
require 'rubocop/rspec/support'
require 'pageflow/support/rubocop'

RSpec.describe RuboCop::Cop::Pageflow::PrivateClassMethod, :config do
  it 'registers offense for symbol argument' do
    expect_offense(<<~RUBY)
      class Foo
        def self.helper; end
        private_class_method :helper
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Define private class methods below `private` inside `class << self`.
      end
    RUBY
  end

  it 'registers offense for inline method definition' do
    expect_offense(<<~RUBY)
      class Foo
        private_class_method def self.helper; end
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Define private class methods below `private` inside `class << self`.
      end
    RUBY
  end

  it 'accepts private inside class << self' do
    expect_no_offenses(<<~RUBY)
      class Foo
        class << self
          private

          def helper; end
        end
      end
    RUBY
  end
end
