import $ from 'jquery';

export const viewWithValidationErrorMessages = {
  onRender() {
    this.listenTo(this.model, 'invalid sync', this.updateValidationErrorMessages);
    this.updateValidationErrorMessages();
  },

  updateValidationErrorMessages() {
    const errors = (this.model.validationErrors &&
                    this.model.validationErrors[this.options.propertyName]) || [];

    if (errors.length) {
      this.validationErrorList = this.validationErrorList ||
                                 $('<ul class="validation_error_messages" />').appendTo(this.el);

      this.validationErrorList.html('');
      errors.forEach(error => this.validationErrorList.append(`<li>${error}</li>`));
      this.$el.addClass('invalid');
    }
    else if (this.validationErrorList) {
      this.validationErrorList.remove();
      this.validationErrorList = null;

      this.$el.removeClass('invalid');
    }
  }
};
