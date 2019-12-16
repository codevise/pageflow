PageflowScrolled::Engine.routes.draw do
  scope module: 'editor' do
    resources :sections, only: :create
  end
end
