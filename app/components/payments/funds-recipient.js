import Ember from 'ember';

const {
  Component,
  computed,
  computed: { alias },
  get
} = Ember;

export default Component.extend({
  classNameBindings: ['highlightClass'],
  classNames: ['funds-recipient', 'panel', 'panel--separated'],

  status: alias('stripeConnectAccount.recipientStatus'),

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
