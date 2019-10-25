# File Import Plugin

File import plugin is a pageflow plugin which extends pageflow functionality 
to import files from currently unsupported sources. File import plugin
should be implemented according to the standard way of developing [Pageflow ERB Widget](creating_widget_types/with_erb_templates.md).

File import plugin should contain the following element:

* A Ruby class extending Pageflow::ImportPlugin that can be registered in
  a host application's Pageflow initializer.

* An ERB template to render the file import view.

* JavaScript for the front end that progressively enhances the HTML.

* Locale files containing translations for the editor and admin UI.

* SCSS to be imported in Pageflow themes.

In the following section, we will go through the steps to create an example File import plugin *Pexels*.
Pexels is a service with a huge collection of stock photos. Suppose pageflow have some users who import
images from pexels to pageflow story. So far they have been doing this manually i.e. downloading the picture
from pexels, uploading to pageflow and assigning it then to the appropriate story and repeating the same process
if there are multiple pictures. To simplify this process we are going to develop pexels file import plugin.
So that pageflow user can import pexel files from within the pageflow story.
Here we are only mentioning the steps to create this plugin. Complete source of this plugin can be found at


## Creating the ImportPlugin Class

We start by creating `Pexel::Plugin < Pageflow::ImportPlugin` class. This class is responsible 
for the integration of plugin with pageflow. This class is also responsible to communicate with pexels.
Any class inheriting `Pageflow::ImportPlugin` is required to implement the following interfaces:

* **authentication_provider**

  This method should return the oauth based authentication provider name which would be `:pexels`
  for this plugin.

* **search(credentials, params)**

  This method should return the list representing the files against search query present in params.
  If authentication is required to talk to the provider then credentials will contain the access token,
  which can be used to make an API call to file provider. This method will also be used to get the initial
  list of images.

* **get_files_meta_data(credentials, params)**
  


* **download_file(credentials, params)**
  This method is invoked by host application after user has pressed Import button, this method is invoked
  for each selected file.


## ERB Template
As mentioned earlier file import plugin requires ERB template to define view, which will be
rendered inside the file importer view.

```ruby
# app/views/pageflow/pexels/widget.html.erb
<div data-widget="pexel_importer">
</div>
```

data-widget attribute should have the value as the name of the widget. Element marked with the data-widget
attribute will be available for enhancing to javascript. The name should be same as it is returned by the 
name method of the widget_type.


## Javascript
If provided pageflow invokes javascript code to enhance the html of the widget. To achieve this we need
to register a javascript enhance function with the plugin. It should be like this

```javascript
// app/assets/javascript/pexel.js
pageflow.widgetTypes.register('pexel_importer', {
  enhance: function(element) {
    // some javascript magic
  }
});
```

Here function parameter `element` is the html element with attribute `data-widget=pexel_importer`


