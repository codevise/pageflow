PageflowScrolled::Engine.routes.draw do
  scope module: 'editor' do
    resources :chapters do
      collection do
        put :order
      end
    end

    resources :sections do
      collection do
        put :order
      end

      resources :content_elements do
        collection do
          put :order
        end
      end
    end
  end
end
