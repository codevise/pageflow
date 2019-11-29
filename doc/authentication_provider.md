Pageflow supports OAuth authorization protocol. It is helpful in getting secure access to some other provider.
Pageflow uses omniAuth gem to enable this feature. To enable oauth in the host application of pageflow following
steps need to be followed:

1. omniauth gem should be installed in the application.
2. omniauth provider strategy should be registered e.g. for facebook it would be like this

```ruby
  Rails.application.config.middleware.use OmniAuth::Builder do
    provider :developer unless Rails.env.production?
    provider :facebook, ENV[:FACEBOOK_APP_ID], ENV[:FACEBOOK_APP_SECRET]
  end
```
3. When authentication is required make a call to `/auth/facebook`. Javascript object `authenticationProvider` can also be used to make this call.
   It make the authentication call in a popup and invokes parent callback when it is finished.
4. After user get authenticated successfully authentication provider like facebook will invoke the registered callback in which pageflow
   will create a database record with user, provider, authentication token and its expiry time. Authentication token stays available till its
   expiry time.
5. ApplicationRecord `AuthenticationToken` can then be used to find authentication token against user and provider