function checkJQueryStatus() {
  if (window.jQuery === undefined) {
    setTimeout(checkJQueryStatus, 100);
    return;
  }
}

// Hyper API
window.API = {
  __offlineAPIWrapper: true,
  __storageWarningTimeoutId: null,

  store: function (force) {
    if (window.ISCOOKIELMS === false) return;

    if (!force && window.Cookies.get('_hyper') === undefined) return;

    window.Cookies.set('_hyper', this.data);

    // a length mismatch will most likely indicate cookie storage limit exceeded
    if (
      window.Cookies.get('_hyper').length !== JSON.stringify(this.data).length
    ) {
      // defer call to avoid excessive alerts
      if (this.__storageWarningTimeoutId == null) {
        this.__storageWarningTimeoutId = setTimeout(
          function () {
            this.storageWarning();
          }.bind(this),
          1000
        );
      }
    }
  },

  fetch: function () {
    if (window.ISCOOKIELMS === false) {
      this.data = {};
      return;
    }

    this.data = window.Cookies.getJSON('_hyper');

    if (!this.data) {
      this.data = {};
      return false;
    }

    return true;
  },

  reset: function () {
    window.Cookies.remove('_hyper');
  },

  createResetButton: function () {
    $('body').append(
      $(
        '<style id="hyper-clear-button">.hyper-reset-button { position:fixed; right:0px; bottom:0px; } </style>'
      )
    );
    var $button = $('<button class="hyper-reset-button">Reset</button>');
    $('body').append($button);
    $button.on(
      'click',
      function () {
        this.reset();
        alert('HYPER tracking cookie has been deleted!');
        window.location.reload();
      }.bind(this)
    );
  },

  storageWarning: function () {
    var Adapt;
    var notificationMethod = alert;
    this.__storageWarningTimeoutId = null;
    if (require) Adapt = require('core/js/adapt');
    if (Adapt && Adapt.config && Adapt.config.has('_hyper')) {
      if (
        Adapt.config.get('_hyper')._advancedSettings &&
        Adapt.config.get('_hyper')._advancedSettings._suppressErrors === true
      ) {
        notificationMethod = console.error;
      }
    }
    notificationMethod(
      'Warning: possible cookie storage limit exceeded - tracking may malfunction'
    );
  },

  LMSInitialize: function () {
    // if (window.ISCOOKIELMS !== false) this.createResetButton();
    if (!this.fetch()) {
      this.data['cmi.core.lesson_status'] = 'not attempted';
      this.data['cmi.suspend_data'] = '';
      this.data['cmi.core.student_name'] = 'Surname, Firstname';
      this.data['cmi.core.student_id'] = 'firstname.surname@example.org';
      this.store(true);
    }
    return 'true';
  },

  LMSFinish: function () {
    return 'true';
  },

  LMSGetValue: function (key) {
    return this.data[key];
  },

  LMSSetValue: function (key, value) {
    var str = 'cmi.interactions.';
    if (key.indexOf(str) !== -1) return 'true';

    this.data[key] = value;

    this.store();
    return 'true';
  },

  LMSCommit: function () {
    return 'true';
  },

  LMSGetLastError: function () {
    return 0;
  },

  LMSGetErrorString: function () {
    return 'Fake error string.';
  },

  LMSGetDiagnostic: function () {
    return 'Fake diagnostic information.';
  },
};

checkJQueryStatus();
