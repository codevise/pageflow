# Creating File Importers

File import plugin is a Pageflow plugin which extends Pageflow functionality
to import files from currently unsupported sources.

File import plugin should contain the following element:

* A Ruby class extending Pageflow::FileImporter, implementing all the
  required methods.

* A plugin class which registers the importer ruby class to Pageflow's
  config list of file importers.

* Backbone view which would get embedded into file importer dialog.

* Locale files containing translations for the editor UI.

* SCSS to be imported in Pageflow.

In the following section, we will go through the steps to create an
example file importer plugin for a fictional stock photo site called
RainbowStock.  Suppose Pageflow users want to import images from
RainbowStock to a Pageflow story. So far they have been doing this
manually i.e. downloading the picture from RainbowStock, uploading to
Pageflow and repeating the same process if there are multiple
pictures.  To simplify this process we are going to develop a plugin
which lets users import picutres directly from the editor.


## Creating the FileImporter Class

We start by creating `RainbowStock::FileImporter <
Pageflow::FileImporter` class. This class should provide the
implementation of the following methods:

1. **authentication_provider** This method is optional but it's very
   important if file importer requires authentication. It should
   return the name of an
   [OmniAuth provider](https://github.com/omniauth/omniauth/wiki/List-of-Strategies)
   registered in the host application, that shall be used to
   authenticate the user and obtain an access token. See the
   [OmniAuth setup guide](./using_omniauth_to_authenticate_with_third_party_apis.md),
   for details.

   Let's imagine there is an OmniAuth strategy to authenticate against
   RainbowStock that is registered in the host application:

   ```ruby
   # my_pageflow_app/config/initializers/omniauth.rb

   Rails.application.config.middleware.use OmniAuth::Builder do
     provider :rainbow_stock, ENV[:RAINBOW_STOCK_KEY], ENV[:RAINBOW_STOCK_SECRET]
   end
   ```

   The `authentication_provider` method should then return the symbol
   `:rainbow_stock`. This will cause an authentication flow using this
   provider to be started in the editor when the user selects to
   import files with this importer.

   If the service does not require user specific authentication, you
   can safely return `nil` here.

2. **search(credentials, params)** This method should return the list
   representing the files against search query present in params.  If
   an `authentication_provder` was specified, the first parameter will
   contain the `token` from the `credentials` object that was passed
   by the provider as part of the
   [OmniAuth auth hash](https://github.com/omniauth/omniauth/wiki/Auth-Hash-Schema).
   Returned data needs to be JSON serializable. It can have any shape
   and will be passed to the file importer specific Backbone view
   described below.

3. **files_meta_data(credentials, params)** This method returns the
   meta data of each selected file. It should be of the following
   format:

   ```
   {
     collection: 'collection_name',
     files: [
       {
         name: file_name.png,
         id: file_id,
         rights: 'file rights',
         url_or_download_options: '',
         type: 'image/png'
       }
     ]
   }
   ```

4. **download_file(credentials, params)** This method is invoked by
   host application after user has pressed Import button. This method
   is invoked for each selected file.

5. **name** Return the string name of the importer.

6. **logo_source** Return the source of the logo displayed in choose
   importer view.

## Plugin class

File importer should also include plugin class with the 'configure'
method. This method should include configuration code required to be
plugged into the host application.

```ruby
# lib/rainbow_stock/plugin.js

module RainbowStock::Plugin
  def configure(config)
    config.features.register('rainbow_stock_importer') do |feature_config|
      feature_config.file_importers.register(RainbowStock::FileImporter.new)
    end
  end
end
```

In the above code it can be seen that importer is registered against the feature `rainbow_stock_importer`.
End user will be able to see the importer when feature is enabled for that user.


## Javascript

Backbone javascript view is required from the file importer plugin.
Similar to ruby code the javascript code needs to be integrated into
host app's javascript.  To do that it needs to be registered into the
list of file importers:

```javascript
# app/assets/javascripts/rainbow_stock/editor.js

pageflow.editor.fileImporters.register('rainbow_stock', {
  createFileImportDialogView: function(fileImport) {
    return new rainbowStock.FileImportDialogView({
      fileImport: fileImport
    });
  }
});
```

This would be the starting point where plugin's javascript code gets
executed. `rainbowStock.FileImportDialogView` is a Backbone Marionette
view that can be implemented however the plugin likes. It will be
displayed in the import dialog inside the editor.

The `fileImport` parameter in the above code is an object which
manages the communication between plugin javascript and Pageflow. It
has following methods:

1. `search(query)` This will call the search method defined in the
   ruby `RainbowStock::FileImporter` class and respond with its
   response. This method can be invoked when plugin is loaded for
   initial set of files, with query equal to entry title or anything
   depending on the plugin.

2. `select(fileModel)` Accepts a Backbone model, that represents a
   file that has been selected. When the user clicks confirms the
   import, `toJSON` will be called on each selected model and the
   array of these JSON representations will be passed to the
   `files_meta_data` method of the Ruby file importer class as `param`
   argument.

3. `unselect: function(fileModel)` Unselects the given file.

## Using Shared Examples to Test Integration

Pageflow provides a set of shared examples that can be used in a
plugin's test suite to ensure the file importer integrates correctly:

```ruby
# rainbow_stock/spec/integration/file_import_spec.rb

require 'spec_helper'
require 'pageflow/lint'

Pageflow::Lint.file_importer(RainbowStock::FileImporter.new)
```
