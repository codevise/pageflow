Dummy::Application.routes.draw do
  mount ::Teaspoon::Engine, at: '/teaspoon' if defined?(Teaspoon)

  devise_for :users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  Pageflow.routes(self)
end
