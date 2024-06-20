import {Object} from 'pageflow/ui';

export const Cutoff = Object.extend({
  initialize({entry}) {
    this.entry = entry;

    this.listenTo(this.entry.metadata.configuration,
                  'change:cutoff_section_perma_id',
                  () => this.trigger('change'));

    this.listenTo(this.entry.sections, 'destroy', (section) => {
      if (this.isAtSection(section)) {
        this.reset();
      }
    });
  },

  isEnabled() {
    return !!this.entry.site.get('cutoff_mode_name');
  },

  isAtSection(section) {
    return this.entry.metadata.configuration.get('cutoff_section_perma_id') === section.get('permaId');
  },

  reset() {
    this.entry.metadata.configuration.unset('cutoff_section_perma_id');
  },

  setSection(section) {
    this.entry.metadata.configuration.set('cutoff_section_perma_id', section.get('permaId'));
  }
});
