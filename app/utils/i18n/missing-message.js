import Ember from 'ember';
import Locale from 'ember-i18n/utils/locale';

const FALLBACK_LOCALE = 'en';

let missingMessage = function(locale, key, data) {
  if (locale === FALLBACK_LOCALE || window.env === 'development') {
    return `Missing translation: ${key}`;
  } else {
    // NOTE This relies on internal APIs and is brittle.
    // Emulating the internals of ember-i18n's translate method.
    let i18n = this;

    let count = Ember.get(data, 'count');

    let defaults = Ember.makeArray(Ember.get(data, 'default'));
    defaults.unshift(key);

    let localeObj = new Locale(FALLBACK_LOCALE, Ember.getOwner(i18n));
    let template = localeObj.getCompiledTemplate(defaults, count);
    return template(data); // english fallback
  }
};

export default missingMessage;
