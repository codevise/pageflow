require 'spec_helper'

require 'support/helpers/rake_test_helper'
require 'support/helpers/suppress_output_test_helper'

RSpec.describe 'create_bundle_symlinks_for_yarn' do
  let(:test_dir) do
    Rails.root.join('tmp', 'bundle_symlinks_for_yarn')
  end

  around do |example|
    test_dir.rmtree if test_dir.exist?
    test_dir.mkdir
    Dir.chdir(test_dir) { suppress_output { example.run } }
  end

  before do
    PageflowScrolled::Engine.load_tasks
  end

  it 'creates symlink for .bundle/for-yarn dependencies' do
    File.write('package.json', <<-JSON)
      {
        "dependencies": {
          "pageflow": "file:.bundle/for-yarn/pageflow/package"
        }
      }
    JSON

    rake 'pageflow_scrolled:create_bundle_symlinks_for_yarn'

    expect(test_dir.join('.bundle/for-yarn/pageflow')).to be_symlink
  end

  it 'supports non-root packages' do
    test_dir.join('package').mkdir
    File.write('package/package.json', <<-JSON)
      {
        "dependencies": {
          "pageflow": "file:../.bundle/for-yarn/pageflow/package"
        }
      }
    JSON

    rake 'pageflow_scrolled:create_bundle_symlinks_for_yarn', 'package/'

    expect(test_dir.join('.bundle/for-yarn/pageflow')).to be_symlink
  end
end
