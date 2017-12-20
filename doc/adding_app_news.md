# Adding App News

Pageflow supports being used together with the
[Krant engine](https://github.com/codevise/krant) to display app news
inside the admin interface.

Pageflow plugins can use the `Pageflow.news_item` method to add news
item without depending directly on Krant. News item are conventionally
stored in a `config/initializers/news` directory containing one file
per news item. This prevents merge conflicts when several pull
requests each include news items. Namespace the news item with the
name of your plugin:

```ruby
# rainbow/config/initializers/news/some_new_feature.rb
Pageflow.news_item('rainbow.some_new_feature',
                   title: {
                     de: 'Ein neues Feature',
                     en: 'Some New Feature'
                   },
                   text: {
                     de: 'Eine mit *Markdown* formatierte Beschreibung.' ,
                     en: 'A description formatted using *Markdown*.'
                   })
```
