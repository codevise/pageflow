PageflowScrolled::Engine.routes.draw do
  scope module: 'editor' do
    resources :fragment_libraries, only: [:index]

    shallow do
      # Legacy path to support editor sessions that span the deploy that
      # introduces the storylines resource above.
      resources :chapters, only: [:create] do
        collection do
          put :order
        end
      end

      resources :storylines, only: [] do
        resources :chapters, only: [:create, :update, :destroy] do
          collection do
            put :order
          end

          resources :fragment_insertions, only: [:create]
          resources :fragment_extractions, only: [:create]

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
    end
  end
end
