import { setProperties, set } from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import PageObject from 'ember-cli-page-object';
import component from 'code-corps-ember/tests/pages/components/github/connected-installation';

let page = PageObject.create(component);

function renderPage() {
  page.render(hbs`
    {{github/connected-installation
      disconnect=(action disconnect)
      connectRepo=(action connectRepo)
      disconnectRepo=(action disconnectRepo)
      organizationGithubAppInstallation=organizationGithubAppInstallation
      project=project
    }}
  `);
}

function setHandlers(context, {
  disconnect = () => {},
  connectRepo = () => {},
  disconnectRepo = () => {}
} = {}) {
  set(context, 'disconnect', disconnect);
  set(context, 'connectRepo', connectRepo);
  set(context, 'disconnectRepo', disconnectRepo);
}

moduleForComponent('github/connected-installation', 'Integration | Component | github/connected installation', {
  integration: true,
  beforeEach() {
    page.setContext(this);
    setHandlers(this);
  },
  afterEach() {
    page.removeContext();
  }
});

const connectedRepo = { id: 1, name: 'Connected Repo', isLoaded: true, syncState: 'synced' };
const unconnectedRepo = { id: 2, name: 'Unconnected Repo', isLoaded: true, syncState: 'unsynced' };
const loadingRepo = { id: 3, isLoaded: false };

const githubAppInstallation = {
  githubAccountLogin: 'foo-login',
  githubAccountAvatarUrl: 'foo-url',
  githubRepos: [connectedRepo, unconnectedRepo, loadingRepo]
};

const organizationGithubAppInstallation = { githubAppInstallation, organization };

const organization = { name: 'Organization' };

const projectGithubRepo = {
  githubRepo: connectedRepo,
  id: 'project-github-repo',
  isLoaded: true,
  syncState: 'synced',
  belongsTo() {
    return { id: () => 1 };
  }
};

const project = {
  id: 'project',
  organization,
  projectGithubRepos: [projectGithubRepo]
};

test('renders correct elements for provided github app installation', function(assert) {
  assert.expect(7);

  setProperties(this, { organizationGithubAppInstallation, project });
  renderPage();

  assert.ok(page.avatar.url.indexOf('foo-url') > -1, 'Avatar url is rendered.');
  assert.equal(page.login.text, 'foo-login', 'Account login is rendered.');
  assert.ok(page.disconnect.text.indexOf(organization.name, 'Organization name is rendered on button.') > -1);

  assert.equal(page.githubRepos().count, 3, 'All repos are rendered.');

  assert.equal(page.githubRepos(0).name.text, 'Connected Repo');
  assert.equal(page.githubRepos(1).name.text, 'Unconnected Repo');
  assert.ok(page.githubRepos(2).loading.isVisible, 'Repo is in loading state.');
});

test('triggers/passes out all actions action', function(assert) {
  assert.expect(4);

  setProperties(this, { organizationGithubAppInstallation, project });
  setHandlers(this, {
    disconnect: () => {
      assert.ok('Disconnect handler was called.');
    },
    connectRepo: (repo, project) => {
      assert.equal(repo.id, 2, 'Correct repo was passed out on called action.');
      assert.equal(project.id, 'project', 'Correct project was passed out on called action.');
    },
    disconnectRepo: (projectGithubRepo) => {
      assert.equal(projectGithubRepo.id, 'project-github-repo', 'Correct repo was passed out on called action.');
    }
  });

  renderPage();

  page.githubRepos(0).click();
  page.githubRepos(0).callout.repoDisconnectConfirmModal.openButton.click();
  page.githubRepos(0).callout.repoDisconnectConfirmModal.modal.input.fillIn(connectedRepo.name);
  page.githubRepos(0).callout.repoDisconnectConfirmModal.modal.disconnectButton.click();
  page.githubRepos(1).click();
  page.githubRepos(1).callout.button.click();
  page.disconnect.click();
});
