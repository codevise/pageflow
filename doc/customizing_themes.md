# Customizing Themes

Pageflow provides a Ruby API which allows customizing themes on a per
account and entry type basis. Note that customization is not theme
specific: All changes will be applied to any theme that is selected
for an entry of the account. So if a user chooses a custom logo or a
custom accent color, it will be used no matter which theme is
selected for an entry.

## Overriding Theme Options

Theme options which have been passed when registering a theme can be
customized:

```
Pageflow.theme_customizations.update(account: some_account,
                                     entry_type: 'rainbow',
                                     overrides: {some: 'override'})
```

The provided overrides will be merged deepy into the theme options of
entries with the given type and account:

```
module Rainbow
  class EntriesController < ActionController::Base
    include Pageflow::EntriesControllerEnvHelper

    def show
      @entry = get_published_entry_from_env
      @entry.theme.options[:some] # => 'override'
    end
  end
end
```

Current settings can be read:

```
theme_customization = Pageflow.theme_customizations.get(account: some_account,
                                                        entry_type: 'rainbow')
theme_customization.overrides # => {some: 'override'}
```

## Customizing Themes with Uploaded Files

Entry types can declare types of files that can be associated with
theme customizations:

```
def entry_type
  Pageflow::EntryType.new(name: 'rainbow',
                          theme_files: {
                            logo: {
                              content_type: %r{\Aimage/},
                              styles: {medium: '100x100>'}
                            }
                          })
end
```

The `content_type` option, determines what sort of files are
allowed. The `styles` option defines which variants of the file should
be generated. See `styles` option of Paperclip attachments for
supported values. `logo`, in this case, is a freely chosen name which
is called the type name of the theme customization file.

Entry type specific controller code can then use the Ruby API to store
an uploaded file:

```
theme_customization_file = Pageflow.theme_customizations.upload_file(
  account: some_account,
  entry_type: 'rainbow',
  type_name: :logo,
  attachment: params[:file]
)
theme_customization_file.file_name # => Name of the originally uploaded file
theme_customization_file.urls[:medium] # => URL to processed file

Pageflow.theme_customizations.update(
  account: some_account,
  entry_type: 'rainbow',
  file_ids: {inverted_logo: theme_customization_file.id}
)
```

The `file_ids` options gives the uploaded file a role
(e.g. `:inverted_logo`) in the theme customization. When customizing a
theme, different files of the same type (as declared via the entry
type) can be associated different roles (e.g. inverted logo, normal logo).

The URLs of associated files can be read from the theme of a published
entry:

```
module Rainbow
  class EntriesController < ActionController::Base
    include Pageflow::EntriesControllerEnvHelper

    def show
      @entry = get_published_entry_from_env
      @entry.theme.files[:inverted_logo][:medium] # => URL to processed file
    end
  end
end
```

Again, current settings can be read:

```
theme_customization = Pageflow.theme_customizations.get(account: some_account,
                                                        entry_type: 'rainbow')
theme_customization.selected_files[:inverted_logo].file_name
```
