import Ember from 'ember';
import moment from 'moment';

const {
  Component,
  computed,
  computed: { empty },
  get
} = Ember;

export default Component.extend({
  classNameBindings: ['highlightClass'],
  classNames: ['create-account', 'panel'],

  required: empty('stripeConnectAccount.id'),

  status: computed('required', function() {
    let required = get(this, 'required');
    return required ? 'required' : 'verified';
  }),

  highlightClass: computed('required', function() {
    let required = get(this, 'required');
    return required ? 'panel--highlighted' : 'panel--highlighted-green';
  }),

  actions: {
    submit() {
      let country = get(this, 'country');
      let tosAcceptanceDate = parseInt(moment.utc().format('X'));

      let onSubmit = get(this, 'onCreateStripeConnectAccount');
      onSubmit({ country, tosAcceptanceDate });
    }
  }
});
