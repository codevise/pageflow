Pageflow::Engine.routes.draw do
  constraints Pageflow.config(:ignore_not_configured => true).editor_route_constraint do
    resources :entries, :only => [:edit, :update], :shallow => true do
      get :partials, :on => :member

      resources :revisions, :only => [:show, :create] do
        delete :current, :to => 'revisions#depublish_current', :on => :collection
      end

      resources :chapters, :only => [:create, :update, :destroy] do
        collection do
          patch :order
        end

        resources :pages, :only => [:create, :update, :destroy] do
          collection do
            patch :order
          end
        end
      end

      resource :edit_lock
    end

    namespace :editor do
      resources :entries, :only => :index, :shallow => true do
        resources :image_files, :only => [:index, :create, :update] do
          get :retry, :on => :member
        end

        resources :video_files, :only => [:index, :create, :update] do
          get :retry, :on => :member
        end

        resources :audio_files, :only => [:index, :create, :update] do
          get :retry, :on => :member
        end

        resources :file_usages, :only => [:create, :destroy]
        resources :encoding_confirmations, :only => [:create]
      end

      resources :quotas, :only => [:show]
    end

    root :to => redirect('/admin')
  end

  get ':entry_id/videos/:id', :to => 'video_files#show', :as => :short_video_file

  resources :entries, :only => [:show]
  get ':id', :to => 'entries#show', :as => :short_entry

  get ':id/pages/:page_index', :to => 'entries#page'
end
