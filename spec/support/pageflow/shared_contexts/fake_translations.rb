RSpec.shared_context 'fake translations' do
  around(:example) do |example|
    i18n_backend_backup = I18n.backend
    @fake_i18n_backend = I18n::Backend::Simple.new

    I18n.backend = @fake_i18n_backend
    example.run
    I18n.backend = i18n_backend_backup
  end

  def translation(locale, key_path, value)
    keys = key_path.split('.')
    last_key = keys.pop
    data = {}

    inner = keys.inject(data) do |result, key|
      result[key] = {}
    end

    inner[last_key] = value
    @fake_i18n_backend.store_translations(locale, data)
  end
end
