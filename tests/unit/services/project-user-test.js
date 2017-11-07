import RSVP from 'rsvp';
import { set, get } from '@ember/object';
import { moduleFor, test } from 'ember-qunit';
import { getFlashMessageCount } from 'code-corps-ember/tests/helpers/flash-message';

let mockStore = {
  createRecord() {
    return {
      save() {
        return RSVP.resolve({ created: true });
      }
    };
  }
};

moduleFor('service:project-user', 'Unit | Service | project user', {
  needs: ['service:current-user', 'service:flash-messages', 'service:session', 'service:metrics'],
  beforeEach() {
    let service = this.subject();
    set(service, 'store', mockStore);
  }
});

test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('it creates a new projectUser with properties', function(assert) {
  let done = assert.async();
  let service = this.subject();

  let currentUser = get(this, 'currentUser.user');

  let user = {
    currentUser,
    project: 'Code Corps',
    role: 'pending' };

  service.joinProject(user).then((result) => {
    set(service, 'store', mockStore);
    let created = get(result, 'created');
    assert.equal(created, true);
    done();
  });
});

test('it creates a flash notification on success', function(assert) {
  let service = this.subject();

  service.flashMessages.create('success!').then(() => {
    assert.equal(getFlashMessageCount(this), 1, 'A flash message was shown.');
  });
});
