import {ChapterItemView} from './ChapterItemView';
import {failureIndicatingView, loadable, editor} from 'pageflow/editor';

export const NavigatableChapterItemView = ChapterItemView.extend({
  mixins: [loadable, failureIndicatingView],

  events: {
    'click a.add_page': function() {
      this.model.addPage();
    },

    'click a.edit_chapter': function() {
      if (!this.model.isNew() && !this.model.isDestroying()) {
        editor.navigate('/chapters/' + this.model.get('id'), {trigger: true});
      }
      return false;
    }
  }
});
