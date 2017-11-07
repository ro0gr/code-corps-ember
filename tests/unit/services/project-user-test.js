import RSVP from 'rsvp';
import { set, get } from '@ember/object';
import { moduleFor, test } from 'ember-qunit';

let mockStore = {
  createRecord() {
    return {
      save() {
        return RSVP.resolve({ created: true });
      }
    };
  }
};

const MockSuccess = {
  createToken: () => RSVP.resolve(TokenResponse)
};

moduleFor('service:project-user', 'Unit | Service | project user', {
  needs: ['service:current-user', 'service:flash-messages'],
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

  let projectUser = {
      currentUser,
      project: 'Code Corps',
      role: 'pending' };


  service.joinProject(projectUser).then((result) => {
    set(service, 'store', mockStore)
    assert.equal(created, true);
    done();

});

test('it creates a flash notification on success', function(assert) {
let service = this.subject();

server.create('projectUser');

andThen(() => {
  assert.equal(getFlashMessageCount(this), 1, 'A flash message was shown.');


});
