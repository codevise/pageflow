PageflowScrolled::Engine.routes.draw do
  scope module: 'editor' do
    shallow do
      resources :storylines, only: [] do
        resources :chapters, only: [:create, :update, :destroy] do
          collection do
            put :order
          end

          resources :sections, only: [:create, :update, :destroy] do
            collection do
              put :order
            end

            member do
              post :duplicate
            end

            resources :content_elements, only: [:create, :update, :destroy] do
              collection do
                put :batch
                put :order
              end
            end
          end
        end
      end

      # Legacy path to support editor sessions that span the deploy that
      # introduces the storylines resource above.
      resources :chapters, only: [:create] do
        collection do
          put :order
        end
      end
    end
  end
end
