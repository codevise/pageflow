# File Import Plugin

File import plugin is a pageflow plugin which extends pageflow functionality 
to import files from currently unsupported sources.

File import plugin should contain the following element:

* A Ruby class extending Pageflow::FileImporter, implementing all the required methods.

* A plugin class which registers the importer ruby class to pageflow's config list of file importers.

* Backbone view which would get embedded into file importer dialog.

* Locale files containing translations for the editor UI.

* SCSS to be imported in Pageflow.

In the following section, we will go through the steps to create an example File import plugin *XYZ*.
XYZ is a service with a huge collection of stock photos. Suppose pageflow have some users who import
images from XYZ to pageflow story. So far they have been doing this manually i.e. downloading the picture
from XYZ, uploading to pageflow and assigning it then to the appropriate story and repeating the same process
if there are multiple pictures, this could take up huge amount of time, giving user very less time to focus on the actual
story content. To simplify this process we are going to develop XYZ file import plugin.
So that pageflow user can import pexel files from within the pageflow story.


## Creating the FileImporter Class

We start by creating `Pageflow::XYZ::FileImporter < Pageflow::FileImporter` class. This class
should provide the implementation of the following methods:

1. **authentication_provider**
   This method is optional but it's very important if file importer requires authentication. This
   method should return the name of authentication provider e.g. in case of facebook it should return
   `:facebook`. XYZ has its simple authentication which requires the authorization header to be included in
   all the API calls, so that's why we will not use pageflow oauth based authentication provider. For more 
   details you can read about [Authentication Provider](./authentication_provider.md)
2. **search(credentials, params)**
   This method should return the list representing the files against search query present in params.
   If authentication is required to talk to the provider then credentials will contain the access token,
   which can be used to make an API call to file provider. This method will also be used to get the initial
   list of images.
3. **files_meta_data(credentials, params)**
   this method returns the meta data of each selected file. It should be of the following format
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
4. **download_file(credentials, params)**
   This method is invoked by host application after user has pressed Import button, this method is invoked
   for each selected file.
5. **name**
   Return the string name of the plugin.
6. **logo_source**
   Return the source of the logo displayed in choose importer view.


## Plugin class
   File importer should also include `Pageflow::{Plugin_namespace}::Plugin` class with the 'configure'
   method. 
   ```ruby
   def configure(config)
   end
   ```
   This method should include configuration code required to be plugged into the host application.
   In our XYZ plugin case this would be:
   ```ruby
    config.file_importers.register('xyz', Pexels::FileImporter.new)
   ```

## Javascript
Backbone javascript view is required from the file importer plugin.
Similar to ruby code the javascript code needs to be integrated into host app's javascript.
To do that it needs to be registered into the list of file importers. like this:

```javascript
pageflow.editor.fileImporters.register('pexels', {
  createFileImportDialogView: function(fileImport) {
    return new pageflow.pexels.FileImportDialogView({
      fileImport: fileImport
    });
  }
});
```

This would be the starting point where plugin's javascript code gets executed. In the code above
there are two important things to consider

1. fileImport 
   The fileImport parameter in the above code is a fileImport model object which will be passed to
   all the file importer plugins. fileImport manages the communication between plugin javascript and host
   application. It has following methods
   
   1. `authenticate: function ()`
      This method is invoked automatically when the file import plugin is selected. Using this method
      plugin gets authenticated. If file importer returns some registered authentication provider then
      OAuth call will be made and a popup will be presented to user to authenticate themselves. User encrypted
      authentication token will be saved in database and forwarded to plugin methods with respective calls.
   
   2. `select: function(file_model)`
      Marks the file as selected in the model.

   3. `unselect: function(file_model)`
      Un selects the given file

   4. `search: function(query)`
      This will call the search method defined in the ruby `Pageflow::XYZ::FileImporter` class and respond
      with its response. This method can be invoked when plugin is loaded for initial set of files,
      with query equal to entry title or anything depending on the plugin.

   5. `getFilesMetaData: function()`
      This will call the files_meta_data method defined in the ruby `Pageflow::XYZ::FileImporter` class and respond
      with its response. This method is called when user clicks import button.

   6. `cancelImport: function(collection_name)`
      This will cancel the current import. Clearing out all the selected files.
