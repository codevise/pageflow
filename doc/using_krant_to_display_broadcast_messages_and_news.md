# Displaying Broadcast Messages and News

Pageflow supports being used together with the
[Krant engine](https://github.com/codevise/krant) to display broadcast
messages and app news inside the admin interface.

Follow the installation steps in Krant's readme. Assuming the
following news collection:

```ruby
# config/applications.rb
module MyPageflowApp
  def self.news
    @news ||= Krant::News.about(MyPageflowApp)
  end
end
```

Then add the following line to your Pageflow initializer:

```ruby
# config/initializers/pageflow.rb
Pageflow.configure do |config|
  config.news = MyPageflowApp.news

  # ...
end
```

This will cause Pageflow and its plugins to add news items to your
collection which will then be displayed on your admin news page using
Krant's view components.
