window.helpers = {
  constants: {
    baseApiUrl: 'https://laravel-9.limbuz.repl.co/api/',
  },

  show(elem) {
    elem.removeAttribute('hidden');
  },

  hide(elem) {
    elem.setAttribute('hidden', '');
  },

  addListener(selector, event, callback, context = {}) {
    document.addEventListener(event, function (e) {
      if (e.target.matches(selector)) {
        callback.call(this, e);
      }
    }.bind(context))
  }
}