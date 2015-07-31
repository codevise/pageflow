RSpec::Matchers.define :have_meta_tag do
  match do |body|
    Capybara.string(body).has_selector?(selectors.join(''), visible: false)
  end

  chain :with_name do |value|
    selectors << "[name='#{value}']"
  end

  chain :for_property do |value|
    selectors << "[property='#{value}']"
  end

  chain :with_content_including do |value|
    selectors << "[content~='#{value}']"
  end

  def selectors
    @selectors ||= ['head meta']
  end
end
