pageflow.PublishEntryView = Backbone.Marionette.ItemView.extend({
  template: 'templates/publish_entry',
  className: 'publish_entry',

  ui: {
    publishUntilFields: '.publish_until_fields',
    publishUntilField: 'input[name=publish_until]',
    publishUntilTimeField: 'input[name=publish_until_time]',
    publishUntilRadioBox: '#publish_entry_until',
    publishForeverRadioBox: 'input[value=publish_forever]',
    revisionsLink: '.published.notice a',
    publishedNotice: '.published.notice',
    saveButton: 'button.save',
    successNotice: '.success',
    successLink: '.success a'
  },

  events: {
    'click button.save': 'save',

    'click input#publish_entry_forever': 'enablePublishForever',

    'click input#publish_entry_until': 'enablePublishUntilFields',

    'focus .publish_until_fields input':  'enablePublishUntilFields',

    'change .publish_until_fields input':  'checkPublishUntil'
  },

  modelEvents: {
    'change': 'update',

    'change:published': function(model, value) {
      if (value) {
        this.ui.publishedNotice.effect('highlight', {
          duration: 'slow'
        });
      }
    }
  },

  onRender: function() {
    this.ui.publishUntilField.datepicker({
      dateFormat: 'dd.mm.yy',
      constrainInput: true,
      defaultDate: new Date(),
      minDate: new Date()
    });

    this.update();
  },

  update: function() {
    this.$el.toggleClass('files_pending', this.model.get('uploading_files_count') > 0 || this.model.get('pending_files_count') > 0);
    this.$el.toggleClass('published', this.model.get('published'));

    this.ui.revisionsLink.attr('href', '/admin/entries/' + this.model.id);
    this.ui.successLink.attr('href', this.model.get('pretty_url'));
    this.ui.successLink.text(this.model.get('pretty_url'));

    var publishedUntil = new Date(this.model.get('published_until'));
    if (publishedUntil > new Date()) {
      this.ui.publishUntilField.datepicker('setDate', publishedUntil);
      this.ui.publishUntilTimeField.val(timeStr(publishedUntil));
    }

    // Helpers
    function timeStr(date) {
      return twoDigits(date.getHours()) + ':' + twoDigits(date.getMinutes());

      function twoDigits(val) {
        return ("0" + val).slice(-2);
      }
    }
  },

  save: function() {
    var publishedUntil = null;

    if (this.$el.hasClass('publishing')) {
      return;
    }

    if (this.ui.publishUntilRadioBox.is(':checked')) {
      publishedUntil = this.ui.publishUntilField.datepicker('getDate');
      setTime(publishedUntil, this.ui.publishUntilTimeField.val());

      if (!this.checkPublishUntilTime()) {
        alert('Bitte legen Sie einen gültigen Depublikationszeitpunkt fest.');
        this.ui.publishUntilTimeField.focus();
        return;
      }

      if (!publishedUntil || !checkDate(publishedUntil)) {
        alert('Bitte legen Sie ein Depublikationsdatum fest.');
        this.ui.publishUntilField.focus();
        return;
      }
    }

    var that = this;

    this.options.entryPublication.publish({published_until: publishedUntil})
      .fail(function() {
        alert('Beim Veröffentlichen ist ein Fehler aufgetreten');
      })
      .always(function() {
        if (that.isClosed) { return; }

        that.$el.removeClass('publishing');
        that.$el.addClass('succeeded');
        that.$('input').removeAttr('disabled');

        var publishedMessage = that.options.entryPublication.get('published_message_html');
        if (publishedMessage) {
          that.ui.successNotice.append(publishedMessage);
        }

        that.enableSave();
      });

    this.$el.addClass('publishing');
    this.$('input').attr('disabled', '1');
    this.disableSave();

    // Helpers
    function setTime(date, time) {
      date.setHours.apply(date, parseTime(time));
    }

    function parseTime(str) {
      return str.split(':').map(function(number) { return parseInt(number, 10); });
    }

    function checkDate(date) {
      if ( Object.prototype.toString.call(date) === "[object Date]" ) {
        if ( isNaN( date.getTime() ) ) {
          return false;
        }
        return true;
      }
      return false;
    }
  },

  enableSave: function() {
    this.ui.saveButton.removeAttr('disabled');
  },

  disableSave: function() {
    this.ui.saveButton.attr('disabled', true);
  },

  enablePublishUntilFields: function() {
    this.ui.publishForeverRadioBox[0].checked = false;
    this.ui.publishUntilRadioBox[0].checked = true;

    this.ui.publishUntilFields.removeClass('disabled');
    this.checkPublishUntil();
  },

  disablePublishUntilFields: function() {
    this.ui.publishUntilRadioBox[0].checked = false;
    this.ui.publishUntilFields.addClass('disabled');

    if (!this.checkPublishUntilTime()) {
      this.ui.publishUntilTimeField.val('00:00');
      this.ui.publishUntilTimeField.removeClass('invalid');
    }
  },

  enablePublishForever: function() {
    this.disablePublishUntilFields();
    this.ui.publishForeverRadioBox[0].checked = true;
    this.enableSave();
  },

  checkPublishUntil: function() {
      var publishedUntil = this.ui.publishUntilField.datepicker('getDate');

      if (!publishedUntil || !this.checkPublishUntilTime()) {
        this.disableSave();
        return false;
      }
      this.enableSave();
      return true;
  },

  checkPublishUntilTime: function() {
    if (!this.ui.publishUntilTimeField.val().match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      this.ui.publishUntilTimeField.addClass('invalid');
      return false;
    }
    this.ui.publishUntilTimeField.removeClass('invalid');
    return true;
  }
});

pageflow.PublishEntryView.create = function(options) {
  return new pageflow.BackButtonDecoratorView({
    view: new pageflow.EntryPublicationQuotaDecoratorView({
      model: options.entryPublication,
      view: new pageflow.PublishEntryView(options)
    })
  });
};
