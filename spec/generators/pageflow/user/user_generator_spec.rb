require 'spec_helper'
require 'support/shared_contexts/generator'
require 'fileutils'

require 'generators/pageflow/user/user_generator'

module Pageflow
  module Generators
    describe UserGenerator, type: :generator do
      before do
        FileUtils.mkdir_p "#{destination_root}/app/models"

        File.write "#{destination_root}/app/models/user.rb", "class User\nend"
      end

      it 'adds the Pageflow user mixin' do
        run_generator
        model = file('app/models/user.rb')
        expect(model).to contain("\n  include Pageflow::UserMixin\n")
      end
    end
  end
end
