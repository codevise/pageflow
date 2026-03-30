RSpec.configure do |config|
  config.before(:suite) do
    packs_dir = Rails.root.join('public', 'packs-test')
    FileUtils.rm_rf(packs_dir) if packs_dir.exist?
  end
end
