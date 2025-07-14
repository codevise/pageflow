RSpec.shared_context 'generator spec', type: :generator do
  destination File.expand_path('../../tmp', __dir__)
  before { prepare_destination }
end
