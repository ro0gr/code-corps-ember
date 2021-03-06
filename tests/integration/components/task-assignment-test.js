import RSVP from 'rsvp';
import { setProperties } from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import PageObject from 'ember-cli-page-object';
import taskAssignmentComponent from 'code-corps-ember/tests/pages/components/task-assignment';
import { Ability } from 'ember-can';
import DS from 'ember-data';
import stubService from 'code-corps-ember/tests/helpers/stub-service';

const { PromiseObject } = DS;

let page = PageObject.create(taskAssignmentComponent);

function renderPage() {
  page.render(hbs`
    {{task-assignment
      task=task
      taskUser=taskUser
      users=users
    }}`);
}

moduleForComponent('task-assignment', 'Integration | Component | task assignment', {
  integration: true,
  beforeEach() {
    page.setContext(this);
    this.register('ability:task', Ability.extend({ canReposition: true }));
  },
  afterEach() {
    page.removeContext();
  }
});

test('assignment works if user has ability', function(assert) {
  let done = assert.async();
  assert.expect(2);

  let task = { id: 'task' };
  let user = { id: 'user', username: 'testuser' };
  let users = [user];

  setProperties(this, { task, users });

  stubService(this, 'current-user', { user });

  stubService(this, 'task-assignment', {
    assign(sentTask, sentUser) {
      assert.deepEqual(sentTask, task, 'Correct task was sent.');
      assert.deepEqual(sentUser, user, 'Correct user was sent.');
      // this is the final step of the async behavior, so we are `done()` here
      done();
      return RSVP.resolve();
    }
  });

  this.register('ability:task', Ability.extend({ canAssign: true }));

  renderPage();

  page.select.trigger.open();
  page.select.dropdown.options(0).select();
});

test('unassignment works if user has ability', function(assert) {
  let done = assert.async();
  assert.expect(1);

  let task = { id: 'task' };
  let user = { id: 'user', username: 'testuser' };
  let users = [user];
  let taskUser = user;

  setProperties(this, { task, users, taskUser });

  stubService(this, 'task-assignment', {
    unassign(sentTask) {
      assert.deepEqual(sentTask, task, 'Correct task was sent.');
      // this is the final step of the async behavior, so we are `done()` here
      done();
      return RSVP.resolve();
    }
  });

  this.register('ability:task', Ability.extend({ canAssign: true }));

  renderPage();

  page.select.trigger.open();
  page.select.dropdown.options(0).select();
});

test('assignment dropdown renders if user has ability', function(assert) {
  assert.expect(2);

  let task = { id: 'task' };
  let user1 = { id: 'user1', username: 'testuser1' };
  let user2 = { id: 'user2', username: 'testuser2' };
  let users = [user1, user2];

  setProperties(this, { task, users });

  stubService(this, 'task-assignment', {
    isAssignedTo() {
      return RSVP.resolve(false);
    }
  });

  this.register('ability:task', Ability.extend({ canAssign: true }));

  renderPage();

  page.select.trigger.open();
  assert.equal(page.select.dropdown.options(0).text, 'testuser1', 'First user is rendered.');
  assert.equal(page.select.dropdown.options(1).text, 'testuser2', 'Second user is rendered.');
});

test('assignment dropdown renders when records are still being loaded', function(assert) {
  let done = assert.async();
  assert.expect(2);

  let task = { id: 'task' };
  let user1 = { id: 'user1', username: 'testuser1' };
  let user2 = { id: 'user2', username: 'testuser2' };

  // this function wraps an object into a structure which simulates a DS records
  // which is in the process of being fetched from the server, meaning that it
  // will have an id, but all other properties will be delegated to the as of
  // yet not populated `content` property
  function proxify(user) {
    let promise = RSVP.resolve(user);
    let { id } = user;
    return PromiseObject.create({ id, promise });
  }

  let users = [user1, user2].map((user) => proxify(user));

  setProperties(this, { task, users });

  this.register('ability:task', Ability.extend({ canAssign: true }));

  renderPage();

  RSVP.all(users).then(() => {
    page.select.trigger.open();
    assert.equal(page.select.dropdown.options(0).text, 'testuser1', 'First user is rendered.');
    assert.equal(page.select.dropdown.options(1).text, 'testuser2', 'Second user is rendered.');
    done();
  });
});

test('assignment dropdown does not render if user has no ability', function(assert) {
  assert.expect(2);

  let task = { id: 'task' };
  let user1 = { id: 'user1', username: 'testuser1' };
  let user2 = {
    id: 'user2',
    username: 'testuser2',
    photoThumbUrl: 'test.png'
  };
  let users = [user1, user2];

  setProperties(this, { task, users, taskUser: user2 });

  stubService(this, 'task-assignment', {
    isAssignedTo() {
      return RSVP.resolve(false);
    }
  });

  this.register('ability:task', Ability.extend({ canAssign: false }));

  renderPage();

  assert.notOk(page.select.triggerRenders, 'Dropdown trigger for assignment does not render.');
  page.assignedUser.as((user) => {
    assert.equal(user.icon.url, 'test.png');
  });
});
