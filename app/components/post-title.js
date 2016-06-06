import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['post-title'],
  classNameBindings: ['isEditing:editing'],

  currentUser: Ember.inject.service(),

  currentUserId: Ember.computed.alias('currentUser.user.id'),
  postAuthorId: Ember.computed.alias('post.user.id'),
  currentUserIsPostAuthor: Ember.computed('currentUserId', 'postAuthorId', function() {
    let userId = parseInt(this.get('currentUserId'), 10);
    let authorId = parseInt(this.get('postAuthorId'), 10);
    return userId === authorId;
  }),

  canEdit: Ember.computed.alias('currentUserIsPostAuthor'),

  didInitAttrs() {
    this.setProperties({
      isEditing: false,
    });
  },

  actions: {
    edit() {
      this.set('newTitle', this.get('post.title'));
      this.set('isEditing', true);
    },

    save() {
      let component = this;
      let post = this.get('post');
      let newTitle = this.get('newTitle');

      post.set('title', newTitle);
      post.save().then(() => {
        component.set('isEditing', false);
      });
    },

    cancel() {
      this.set('isEditing', false);
    }
  }
});
