pageflow.StorylinePickerView = Backbone.Marionette.Layout.extend({
  template: 'templates/storyline_picker',
  className: 'storyline_picker',

  regions: {
    selectRegion: '.storyline_picker_select_region',
    mainRegion: '.storyline_picker_main_region'
  },

  ui: {
    storylines: '.storyline_picker_storylines'
  },

  events: {
    'click .add_storyline': function() {
      var storyline = pageflow.entry.scaffoldStoryline({
        depth: 'page'
      }).storyline;

      this.listenToOnce(storyline, 'sync', function() {
        this.updateSelect();
        this.model.set('storyline_id', storyline.id);
      });

      return false;
    },

    'click .edit_storyline': function() {
      pageflow.editor.navigate('storylines/' + this.model.get('storyline_id'), {trigger: true});
      return false;
    }
  },

  initialize: function() {
    this.model = new Backbone.Model({
      storyline_id: this.defaultStorylineId()
    });

    this.listenTo(pageflow.storylines, 'add sort remove', this.updateSelect);
    this.listenTo(this.model, 'change', this.load);
  },

  onRender: function() {
    this.$el.toggleClass('editable', !!this.options.editable);
    this.ui.storylines.toggle(!!pageflow.features.isEnabled('storylines'));

    this.updateSelect();
    this.load();
  },

  updateSelect: function() {
    this.selectRegion.show(new pageflow.SelectInputView({
      model: this.model,
      label: I18n.t('pageflow.editor.views.storylines_picker_view.label'),
      propertyName: 'storyline_id',
      values: pageflow.storylines.pluck('id'),
      texts: pageflow.storylines.map(function(storyline) {
        return this.indentation(storyline) + storyline.displayTitle();
      }, this),
      groups: pageflow.storylines.reduce(function(result, storyline) {
        if (storyline.isMain() || storyline.parentPage()) {
          result.push(_.last(result));
        }
        else {
          result.push(I18n.t('pageflow.editor.views.storylines_picker_view.without_parent_page'));
        }
        return result;
      }, [])
    }));
  },

  load: function() {
    var storyline = pageflow.storylines.get(this.model.get('storyline_id'));

    this.saveRememberedStorylineId(storyline.id);

    this.mainRegion.show(new pageflow.StorylineOutlineView({
      model: storyline,
      navigatable: this.options.navigatable,
      sortable: this.options.editable,
      chapterItemView: this.options.chapterItemView,
      pageItemView: this.options.pageItemView,
      pageItemViewOptions: this.options.pageItemViewOptions,
      displayInNavigationHint: this.options.displayInNavigationHint
    }));
  },

  defaultStorylineId: function() {
    var storyline =
      pageflow.storylines.get(this.options.storylineId) ||
      pageflow.storylines.get(this.rememberedStorylineId()) ||
      pageflow.storylines.first();

    return storyline.id;
  },

  rememberedStorylineId: function() {
    if (this.options.rememberLastSelection) {
      return pageflow.StorylinePickerView._rememberedStorylineId;
    }
  },

  saveRememberedStorylineId: function(id) {
    if (this.options.rememberLastSelection) {
      pageflow.StorylinePickerView._rememberedStorylineId = id;
    }
  },

  indentation: function(storyline) {
    return _(storyline.get('level') || 0).times(function() {
      return '\u00A0\u00A0\u00A0';
    }).join('');
  }
});