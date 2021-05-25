export const serverSideValidation = {
  initialize() {
    this.validationErrors = {};

    this.listenTo(this, 'error', (model, request) => {
      if (request.status === 422) {
        this.validationErrors = JSON.parse(request.responseText).errors;
        this.trigger('invalid');
      }
    });

    this.listenTo(this, 'sync', () => {
      this.validationErrors = {};
    });
  }
};
