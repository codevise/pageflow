# Using the Nginx Upload Module

Pageflow supports handling file uploads with
the
[`nginx-upload-module`](https://github.com/vkholodkov/nginx-upload-module) and
the
[`paperclip-nginx-upload` io adapter](https://github.com/tf/paperclip-nginx-upload).

This setup allows Nginx to parse file uploads from requests and only
pass paths to temporary files to the Rails application. This can take
a lot of load off your Rails worker processes.

## Example Configuration

Make sure your Nginx has been compiled with the
`nginx-upload-module`. Then enable the `nginx-upload` module for the
HTTP endpoint used by Pageflow to accept file uploads:

```
  location ~ ^/editor/entries/[0-9]+/files/[^/]+/?$ {
    upload_pass @app_pageflow;

    upload_store /mnt/nginx_uploads 1;
    upload_store_access user:rw group:rw all:r;

    upload_set_form_field $upload_field_name[original_name] "$upload_file_name";
    upload_set_form_field $upload_field_name[content_type] "$upload_content_type";
    upload_set_form_field $upload_field_name[tmp_path] "$upload_tmp_path";

    upload_pass_form_field "^entry_id$|^authenticity_token$|^format$|\[configuration\]|\[rights\]|\[parent_file_model_type\]|\[parent_file_id\]";
    upload_cleanup 400 404 409 500-505;

    # Catch "Method not allowed" raised for non-POST requests and
    # delegate to app
    error_page 405 = @app_pageflow;
  }

  location @app_pageflow {
    passenger_enabled on;
    # ...
  }
```

Now add the `paperclip-nginx-upload` gem to your `Gemfile`:

```ruby
# Paperclip io adapter for integration with nginx upload module
gem 'paperclip-nginx-upload', '~> 1.0'
```

Finally create an initializer to configure it:

```ruby
# config/initializers/paperclip_nginx_upload.rb
require 'paperclip/nginx/upload'

Paperclip::Nginx::Upload::IOAdapter.default_options.merge!(
  # Location where nginx places file uploads
  tmp_path_whitelist: ['/tmp/nginx_uploads/**'],

  # Change this option to true to move temp files created
  # by nginx to the paperclip tmp file location. By default
  # files are copied.
  move_tempfile: false
)
```

Be sure to study the README files of both projects to understand
security implications of this approach.
