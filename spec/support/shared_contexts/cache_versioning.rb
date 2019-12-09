RSpec.shared_context 'cache versioning' do
  around(:example) do |example|
    cache_versioning_backup = Pageflow::ApplicationRecord.cache_versioning

    begin
      example.run
    ensure
      Pageflow::ApplicationRecord.cache_versioning = cache_versioning_backup
    end
  end

  def enable_cache_versioning
    Pageflow::ApplicationRecord.cache_versioning = true
  end

  def disable_cache_versioning
    Pageflow::ApplicationRecord.cache_versioning = false
  end
end
