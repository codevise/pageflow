pageflow.FilesView = Backbone.Marionette.ItemView.extend({
  template: 'templates/files',
  className: 'manage_files',

  events: {
    'click a.back': 'goBack',

    'file-selected': 'updatePage'
  },

  onRender: function() {
    this.addFileModel = new Backbone.Model({
      label: 'Hinzufügen',
      options: [
        {
          label: 'Hochladen',
          handler: this.upload.bind(this)
        },
        {
          label: 'Wiederverwenden',
          handler: function() {
            pageflow.FilesExplorerView.open({
              callback: pageflow.entry.addFileUsage.bind(pageflow.entry)
            });
          }
        }
      ]
    });

    this.$el.append(this.subview(new pageflow.SelectButtonView({model: this.addFileModel })).el);

    this.tabsView = new pageflow.TabsView({
      model: this.model,
      i18n: 'editor.files.tabs',
      defaultTab: this.options.tabName
    });

    this.tab('image_files', {
      collection: this.model.imageFiles,
      itemView: pageflow.ImageFileItemView
    });

    this.tab('video_files', {
      collection: this.model.videoFiles,
      itemView: pageflow.VideoFileItemView
    });

    this.tab('audio_files', {
      collection: this.model.audioFiles,
      itemView: pageflow.AudioFileItemView
    });

    this.$el.append(this.subview(this.tabsView).el);
  },

  tab: function(name, options) {
    this.tabsView.tab(name, _.bind(function() {
      return this.subview(new pageflow.CollectionView({
        tagName: 'ul',
        className: 'files expandable',
        collection: options.collection,
        itemViewConstructor: options.itemView,
        itemViewOptions: {
          selectable: this.options.tabName === name
        },
        blankSlateViewConstructor: Backbone.Marionette.ItemView.extend({
          template: 'templates/files_blank_slate'
        })
      }));
    }, this));

    this.listenTo(this.model, 'change:uploading_' + name +'_count', function(model, value) {
      this.tabsView.toggleSpinnerOnTab(name, value > 0);
    });
  },

  goBack: function() {
    if (this.options.page) {
      editor.navigate('/pages/' + this.options.page.id + '/files', {trigger: true});
    }
    else {
      editor.navigate('/', {trigger: true});
    }
  },

  upload: function() {
    pageflow.app.trigger('request-upload');
  },

  updatePage: function(event, file) {
    if (this.options.page) {
      this.options.page.configuration.setReference(this.options.pageAttributeName, file);
      this.goBack();
    }
  }
});
