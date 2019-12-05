# Using OmniAuth to Authenticate with Third Party APIs

Pageflow supports authenticating with third party APIs and storing
access tokens. Pageflow builds upon the
[OmniAuth gem](https://github.com/omniauth/omniauth), which needs to
be installed and configured in the host appplication.

## Host Application OmniAuth Setup

To install OmniAuth in the host application of Pageflow, perform the
following steps:

1. Add the `omniauth` gem to your `Gemfile`.

2. Register the OmniAuth providers required by the Pageflow plugins
   you want to use. See the install instructions of the respective
   Pageflow plugin for details.

   ```ruby
     # config/initializers/omniauth.rb

     Rails.application.config.middleware.use OmniAuth::Builder do
       provider :developer unless Rails.env.production?
       provider :my_servive, ENV[:MY_SERVICE_KEY], ENV[:MY_SERVICE_SECRET]
     end
   ```

3. Configure symmetric encryption in your Pageflow initializer:

   ```ruby
   # config/initializers/pageflow.rb

   config.encryption_options.merge!(
     key: ENV.fetch('SYMMETRIC_ENC_KEY'),
     iv: ENV.fetch('SYMMETRIC_ENC_IV')
   )
   ```

   This is used to encrypt access tokens stored in the database.

Pageflow already provides the callback route required by OmniAuth to
handle authentication responses.
