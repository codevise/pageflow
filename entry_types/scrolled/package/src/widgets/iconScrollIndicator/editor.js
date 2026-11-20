import {editor} from 'pageflow-scrolled/editor';
import {ConfigurationEditorView, SelectInputView} from 'pageflow/ui';

editor.widgetTypes.register('iconScrollIndicator', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function() {
      const firstSection = this.options.entry.sections.first();

      if (firstSection) {
        this.options.entry.trigger('scrollToSection', firstSection);
      }

      this.tab('iconScrollIndicator', function() {
        this.input('alignment', SelectInputView, {
          values: ['centerContent', 'centerViewport']
        });
        this.input('size', SelectInputView, {
          defaultValue: 'small',
          values: ['large', 'small']
        });
        this.input('animation', SelectInputView, {
          defaultValue: 'smallBounce',
          values: ['none', 'smallBounce', 'largeBounce']
        });

      });
    }
  })
});
