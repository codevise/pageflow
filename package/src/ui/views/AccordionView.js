import ChildViewContainer from 'backbone.babysitter';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

/**
 * Display views in collapsible sections.
 *
 * By default, sections can be expanded independently by clicking
 * their titles and the first section starts expanded. If the
 * `selectionModel` and `selectionPropertyName` options are passed,
 * section headers display radio buttons and only the section whose
 * `value` is stored in the selection model is expanded.
 *
 * @param {Object} [options]
 * @param {Backbone.Model} [options.model]
 *   Model passed to inputs and views of sections.
 * @param {Backbone.Model} [options.selectionModel]
 *   Model storing the value of the selected section.
 * @param {string} [options.selectionPropertyName]
 *   Property of the selection model storing the selected section.
 *
 * @class
 */
export const AccordionView = Marionette.View.extend({
  className: 'accordion_view',

  initialize: function() {
    this.sections = [];
    this.currentSection = null;

    if (this.options.selectionModel) {
      this.listenTo(this.options.selectionModel,
                    `change:${this.options.selectionPropertyName}`,
                    this.updateSelection);
    }
  },

  /**
   * Add a section. Inputs and views added inside the callback are
   * rendered inside the section.
   *
   * @param {string} name - Title of the section.
   * @param {Object} [options]
   * @param {string} [options.description] - Text displayed below the title.
   * @param {string} [options.value] - Value stored in the selection model.
   * @param {boolean} [options.fill] - Let the expanded section fill the remaining height.
   * @param {Function} callback
   */
  section: function(name, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    this.currentSection = {
      name,
      key: options.value || name,
      description: options.description,
      fill: !!options.fill,
      inputs: new ChildViewContainer()
    };
    this.sections.push(this.currentSection);

    callback.call(this);

    this.currentSection = null;
  },

  input: function(propertyName, view, options) {
    this.view(view, _.extend({
      placeholderModel: this.options.placeholderModel,
      propertyName: propertyName,
      attributeTranslationKeyPrefixes: this.options.attributeTranslationKeyPrefixes
    }, options || {}));
  },

  view: function(view, options) {
    if (!this.currentSection) {
      throw new Error('AccordionView: view() must be called inside section()');
    }

    this.currentSection.inputs.add(new view(_.extend({
      model: this.model,
      parentTab: this.options.parentTab
    }, options || {})));
  },

  /**
   * Toggle whether the section fills the remaining height while
   * expanded.
   *
   * @param {string} key - Value or name of the section.
   * @param {boolean} fill
   */
  setSectionFill: function(key, fill) {
    const section = this.sections.find(section => section.key === key);

    section.fill = fill;

    if (section.element) {
      section.element.classList.toggle('accordion_view-section-fill', fill);
    }
  },

  render: function() {
    const groupName = `accordion-${this.cid}`;

    this.sections.forEach((section, index) => {
      section.element = this.options.selectionModel ?
                        this.renderSelectableSection(section, groupName) :
                        this.renderCollapsibleSection(section, groupName, index);

      section.element.classList.toggle('accordion_view-section-fill', section.fill);
      this.el.appendChild(section.element);
    });

    this.updateSelection();

    return this;
  },

  renderCollapsibleSection: function(section, groupName, index) {
    const details = document.createElement('details');
    details.className = 'accordion_view-section';
    details.name = groupName;
    details.open = index === 0;

    const summary = document.createElement('summary');
    summary.className = 'accordion_view-header accordion_view-summary';
    summary.appendChild(this.renderHeaderText(section));

    details.appendChild(summary);
    details.appendChild(this.renderContent(section));

    return details;
  },

  renderSelectableSection: function(section, groupName) {
    const element = document.createElement('div');
    element.className = 'accordion_view-section accordion_view-selectable_section';

    const label = document.createElement('label');
    label.className = 'accordion_view-header';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = groupName;
    radio.value = section.key;
    radio.addEventListener('change', () => {
      this.options.selectionModel.set(this.options.selectionPropertyName, section.key);
    });

    label.appendChild(radio);
    label.appendChild(this.renderHeaderText(section));

    element.appendChild(label);
    element.appendChild(this.renderContent(section));

    section.radio = radio;

    return element;
  },

  renderHeaderText: function(section) {
    const text = document.createElement('span');
    text.className = 'accordion_view-header_text';

    const title = document.createElement('span');
    title.className = 'accordion_view-title';
    title.textContent = section.name;
    text.appendChild(title);

    if (section.description) {
      const description = document.createElement('span');
      description.className = 'accordion_view-description';
      description.textContent = section.description;
      text.appendChild(description);
    }

    return text;
  },

  renderContent: function(section) {
    const content = document.createElement('div');
    content.className = 'accordion_view-content';

    section.inputs.each(function(input) {
      content.appendChild(input.render().el);
    });

    section.content = content;

    return content;
  },

  updateSelection: function() {
    if (!this.options.selectionModel) {
      return;
    }

    const selectedKey = this.options.selectionModel.get(this.options.selectionPropertyName);

    this.sections.forEach(section => {
      if (!section.element) {
        return;
      }

      const selected = section.key === selectedKey;

      section.radio.checked = selected;
      section.content.hidden = !selected;
      section.element.classList.toggle('accordion_view-section-selected', selected);
    });
  },

  onClose: function() {
    this.sections.forEach(section => {
      section.inputs.call('close');
    });
  }
});
