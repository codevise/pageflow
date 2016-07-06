RSpec.shared_context 'generator spec', type: :generator do
  destination File.expand_path('../../../tmp', __FILE__)
  before { prepare_destination }
end
