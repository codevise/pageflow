= Adding new Page Types =

 The addition of a new Page Type to an installation Pageflow requires a couple of steps depending on what features of Pagedflow the new Page Type uses.

 * Add gem containing the Page Type to `Gemfile`.

 * Register Page Type in `config/initializers/pageflow.rb`

    config.register_page_type(Pageflow::ExternalLinks::PageType.new)

 * Add Javascript extensions for public site to `app/assets/javascripts/application.js`

   //= require "pageflow/new_page_type"

 * Add Javascript editor extensions to `app/assets/javascripts/pageflow/editor.js`

    //= require pageflow/new_page_type/editor

 * Add CSS extensions for public site to `app/assets/stylesheets/application.css`

    @import "pageflow/new_page_type";

 * Add CSS extensions for editor to `app/assets/stylesheets/pageflow/editor.css.scss`

    @import "pageflow/editor/base";
    @import "pageflow/new_page_type/editor";

 * Add routes of new page type in `/config/routes.rb`

    authenticated do
      mount Pageflow::NewPageType::Engine, :at => '/new_page_type'
    end

 * Bundle install
 * Run migrations.
