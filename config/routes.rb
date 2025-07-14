Pageflow::Engine.routes.draw do
  constraints Pageflow.config(ignore_not_configured: true).editor_route_constraint do
    resources :entries, only: [], shallow: true do
      get :partials, on: :member

      resources :revisions, only: [:show] do
        get :stylesheet, on: :member
        delete :current, to: 'revisions#depublish_current', on: :collection
      end

      resources :storylines, only: [:create, :update, :destroy] do
        collection do
          put :order
          post :scaffold
        end

        resources :chapters, only: [:create, :update, :destroy] do
          collection do
            put :order
            post :scaffold
          end

          resources :pages, only: [:create, :update, :destroy] do
            collection do
              put :order
            end
          end
        end
      end

      resource :edit_lock
    end

    namespace :admin do
      devise_scope :user do
        resource :initial_password, only: [:edit, :update]
      end
    end

    namespace :editor do
      resources :entries, only: [:index, :show, :update], shallow: true do
        get :seed, on: :member

        resources :file_usages, only: [:create, :destroy]

        resources :encoding_confirmations, only: [:create] do
          post :check, on: :collection
        end

        resources :entry_publications, only: [:create] do
          post :check, on: :collection
        end

        Pageflow.config(ignore_not_configured: true).entry_types.routes(self)
      end

      resources :entries, only: [] do
        resources :files,
                  path: 'files/:collection_name',
                  only: [:index, :create, :update, :destroy] do
          post :reuse, on: :collection
          post :retry, on: :member
          put :publish, on: :member
        end

        get '/file_import/:file_import_name/search' => 'file_import#search'
        post '/file_import/:file_import_name/files_meta_data' => 'file_import#files_meta_data'
        post '/file_import/:file_import_name/start_import_job' => 'file_import#start_import_job'
      end

      resources :subjects, path: '/subjects/:collection_name', only: [] do
        resources :widgets, only: [:index] do
          patch :batch, on: :collection
        end
      end
    end

    root to: redirect('/admin')
  end

  get ':entry_id/videos/:id', to: 'files#show', as: :short_video_file,
                              defaults: {collection_name: 'video_files'}
  get ':entry_id/audio/:id', to: 'files#show', as: :short_audio_file,
                             defaults: {collection_name: 'audio_files'}

  resources :entries, only: [:show] do
    get :stylesheet, on: :member
  end

  # Authentication provider call back
  get '/auth/:provider/callback', to: 'users/omniauth_callbacks#auth_callback'

  get 'feeds/:locale', to: 'feeds#index', as: :feed
  get 'sitemap', to: 'sitemaps#index', as: :sitemap

  get ':id/manifest', to: 'entries#manifest', as: :entry_manifest
  get ':id/embed', to: 'entries#show', defaults: {embed: '1'}, as: :entry_embed

  get ':id/pages/:page_index', to: 'entries#page'

  get ':id', to: 'entries#show', as: :short_entry
  get '*directory:id', to: 'entries#show', as: :permalink, constraints: {directory: %r{(.+/)*}}

  get '/', to: 'entries#index', as: :public_root
end
