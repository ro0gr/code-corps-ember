import Ember from 'ember';

const {
  Component,
  computed,
  get
} = Ember;

export default Component.extend({
  classNameBindings: ['highlightClass'],
  classNames: ['bank-account', 'panel', 'panel--separated'],

  accountNumber: null,
  routingNumber: null,

  status: computed.alias('stripeConnectAccount.bankAccountStatus'),

  highlightClass: computed('status', function() {
    let status = get(this, 'status');

    if (status == 'verified') {
      return 'panel--highlighted-green';
    } else if (status == 'required') {
      return 'panel--highlighted';
    } else {
      return '';
    }
  })
});
