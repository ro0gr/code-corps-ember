import { moduleFor, test } from 'ember-qunit';

moduleFor('route:project/settings/donations/payments', 'Unit | Route | project/settings/donations/payments', {
  needs: [
    'service:metrics',
    'service:router-scroll',
    'service:scheduler'
  ]
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
