import Ember from 'ember';

const {
  Component,
  computed,
  get
} = Ember;

export default Component.extend({
  classNameBindings: ['highlightClass'],
  classNames: ['donation-goals', 'panel'],

  status: computed('donationsActive', 'transfersEnabled', function() {
    let donationsActive = get(this, 'donationsActive');
    let transfersEnabled = get(this, 'transfersEnabled');

    if (donationsActive) {
      return 'verified';
    } else if (transfersEnabled) {
      return 'required';
    } else {
      return 'pending_requirement';
    }
  }),

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
