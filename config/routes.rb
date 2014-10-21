Pageflow::Engine.routes.draw do
  constraints Pageflow.config(:ignore_not_configured => true).editor_route_constraint do
    resources :entries, :only => [:edit, :update], :shallow => true do
      get :partials, :on => :member

      resources :revisions, :only => [:show] do
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
        resources :files, :path => 'files/:collection_name', :only => [:index, :create, :update] do
          get :retry, :on => :member
        end

        resources :file_usages, :only => [:create, :destroy]

        resources :encoding_confirmations, :only => [:create] do
          post :check, :on => :collection
        end

        resources :entry_publications, :only => [:create] do
          post :check, :on => :collection
        end
      end
    end

    root :to => redirect('/admin')
  end

  get ':entry_id/videos/:id', :to => 'files#show', :as => :short_video_file, :defaults => {:collection_name => 'video_files'}
  get ':entry_id/audio/:id', :to => 'files#show', :as => :short_audio_file, :defaults => {:collection_name => 'audio_files'}

  resources :entries, :only => [:show]
  get ':id', :to => 'entries#show', :as => :short_entry
  get '/', :to => 'entries#index', :as => :public_root

  get ':id/pages/:page_index', :to => 'entries#page'
end
