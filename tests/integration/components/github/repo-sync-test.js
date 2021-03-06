import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import PageObject from 'ember-cli-page-object';
import component from 'code-corps-ember/tests/pages/components/github/repo-sync';

let page = PageObject.create(component);

function renderPage() {
  page.render(hbs`
    {{github/repo-sync
      githubRepo=githubRepo
      projectGithubRepo=projectGithubRepo
    }}
  `);
}

function percentForStep(number) {
  return (number / 9) * 100;
}

moduleForComponent('github/repo-sync', 'Integration | Component | github/repo sync', {
  integration: true,
  beforeEach() {
    page.setContext(this);
  },
  afterEach() {
    page.removeContext();
  }
});

test('it renders everything for the default state', function(assert) {
  let githubRepo = { syncState: 'unsynced' };
  let projectGithubRepo = { syncState: 'unsynced' };
  this.set('githubRepo', githubRepo);
  this.set('projectGithubRepo', projectGithubRepo);
  renderPage();
  assert.ok(page.progressBar.displaysPercentage(0), 'The progress bar has not started.');
  assert.ok(page.progressBar.isAnimated, 'Progress bar is animated.');
  assert.equal(page.progressText.text, 'Starting sync...', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubRepoPull, 'Repo pull icon renders.');
});

test('it renders for the sync states', function(assert) {
  renderPage();

  this.set('projectGithubRepo', { syncState: 'syncing_github_repo' });

  this.set('githubRepo', { syncState: 'fetching_pull_requests' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(1)), 'The progress bar has progressed to step 1.');
  assert.ok(page.progressBar.isAnimated, 'Progress bar is animated.');
  assert.equal(page.progressText.text, 'Fetching pull requests...', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubPullRequest, 'Pull request icon renders.');

  this.set('githubRepo', { syncState: 'syncing_github_pull_requests', syncingPullRequestsCount: '1234' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(2)), 'The progress bar has progressed to step 2.');
  assert.ok(page.progressBar.isAnimated, 'Progress bar is animated.');
  assert.equal(page.progressText.text, 'Syncing 1,234 pull requests...', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubPullRequest, 'Pull request icon renders.');

  this.set('githubRepo', { syncState: 'fetching_issues' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(3)), 'The progress bar has progressed to step 3.');
  assert.ok(page.progressBar.isAnimated, 'Progress bar is animated.');
  assert.equal(page.progressText.text, 'Fetching issues...', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubIssue, 'Issue icon renders.');

  this.set('githubRepo', { syncState: 'syncing_github_issues', syncingIssuesCount: '1234' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(4)), 'The progress bar has progressed to step 4.');
  assert.ok(page.progressBar.isAnimated, 'Progress bar is animated.');
  assert.equal(page.progressText.text, 'Syncing 1,234 issues...', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubIssue, 'Issue icon renders.');

  this.set('githubRepo', { syncState: 'fetching_comments' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(5)), 'The progress bar has progressed to step 5.');
  assert.ok(page.progressBar.isAnimated, 'Progress bar is animated.');
  assert.equal(page.progressText.text, 'Fetching comments...', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubComments, 'Comments icon renders.');

  this.set('githubRepo', { syncState: 'syncing_github_comments', syncingCommentsCount: '1234' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(6)), 'The progress bar has progressed to step 6.');
  assert.ok(page.progressBar.isAnimated, 'Progress bar is animated.');
  assert.equal(page.progressText.text, 'Syncing 1,234 comments...', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubComments, 'Comments icon renders.');

  this.set('githubRepo', { syncState: 'receiving_webhooks' });

  this.set('projectGithubRepo', { syncState: 'syncing_tasks' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(7)), 'The progress bar has progressed to step 7.');
  assert.ok(page.progressBar.isAnimated, 'Progress bar is animated.');
  assert.equal(page.progressText.text, 'Syncing your GitHub issues with your tasks...', 'The progress text renders.');
  assert.ok(page.spriteIcon.isTasks, 'Tasks icon renders.');

  this.set('projectGithubRepo', { syncState: 'syncing_comments' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(8)), 'The progress bar has progressed to step 8.');
  assert.ok(page.progressBar.isAnimated, 'Progress bar is animated.');
  assert.equal(page.progressText.text, 'Syncing your GitHub comments with your comments...', 'The progress text renders.');
  assert.ok(page.spriteIcon.isComments, 'Comments icon renders.');

  this.set('projectGithubRepo', { syncState: 'synced' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(9)), 'The progress bar has completed.');
  assert.notOk(page.progressBar.isAnimated, 'Progress bar is not animated.');
  assert.equal(page.progressText.text, 'Sync complete!', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubRepoClone, 'Repo clone icon renders.');
});

test('it renders for the error states', function(assert) {
  renderPage();
  this.set('githubRepo', { syncState: 'errored_fetching_pull_requests' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(1)), 'The progress bar has stopped at the current stage.');
  assert.notOk(page.progressBar.isAnimated, 'Progress bar is not animated.');
  assert.equal(page.progressText.text, 'An error occurred fetching your pull requests. You can retry the sync now.', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubPullRequest, 'Pull request icon renders.');

  this.set('githubRepo', { syncState: 'errored_syncing_github_pull_requests' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(2)), 'The progress bar has stopped at the current stage.');
  assert.notOk(page.progressBar.isAnimated, 'Progress bar is not animated.');
  assert.equal(page.progressText.text, 'An error occurred syncing your pull requests. You can retry the sync now.', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubPullRequest, 'Pull request icon renders.');

  this.set('githubRepo', { syncState: 'errored_fetching_issues' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(3)), 'The progress bar has stopped at the current stage.');
  assert.notOk(page.progressBar.isAnimated, 'Progress bar is not animated.');
  assert.equal(page.progressText.text, 'An error occurred fetching your issues. You can retry the sync now.', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubIssue, 'Issue icon renders.');

  this.set('githubRepo', { syncState: 'errored_syncing_github_issues' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(4)), 'The progress bar has stopped at the current stage.');
  assert.notOk(page.progressBar.isAnimated, 'Progress bar is not animated.');
  assert.equal(page.progressText.text, 'An error occurred syncing your issues. You can retry the sync now.', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubIssue, 'Issue icon renders.');

  this.set('githubRepo', { syncState: 'errored_fetching_comments' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(5)), 'The progress bar has stopped at the current stage.');
  assert.notOk(page.progressBar.isAnimated, 'Progress bar is not animated.');
  assert.equal(page.progressText.text, 'An error occurred fetching your comments. You can retry the sync now.', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubComments, 'Comments icon renders.');

  this.set('githubRepo', { syncState: 'errored_syncing_github_comments' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(6)), 'The progress bar has stopped at the current stage.');
  assert.notOk(page.progressBar.isAnimated, 'Progress bar is not animated.');
  assert.equal(page.progressText.text, 'An error occurred syncing your comments. You can retry the sync now.', 'The progress text renders.');
  assert.ok(page.spriteIcon.isGithubComments, 'Comments icon renders.');

  this.set('githubRepo', { syncState: 'receiving_webhooks' });

  this.set('projectGithubRepo', { syncState: 'errored_syncing_tasks' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(7)), 'The progress bar has stopped at the current stage.');
  assert.notOk(page.progressBar.isAnimated, 'Progress bar is not animated.');
  assert.equal(page.progressText.text, 'An error occurred syncing your GitHub issues with your tasks. You can retry the sync now.', 'The progress text renders.');
  assert.ok(page.spriteIcon.isTasks, 'Tasks icon renders.');

  this.set('projectGithubRepo', { syncState: 'errored_syncing_comments' });
  assert.ok(page.progressBar.displaysPercentage(percentForStep(8)), 'The progress bar has stopped at the current stage.');
  assert.notOk(page.progressBar.isAnimated, 'Progress bar is not animated.');
  assert.equal(page.progressText.text, 'An error occurred syncing your GitHub comments with your comments. You can retry the sync now.', 'The progress text renders.');
  assert.ok(page.spriteIcon.isComments, 'Comments icon renders.');
});

test('it does not renders the error progress bar for non-error states', function(assert) {
  renderPage();
  this.set('githubRepo', { syncState: 'syncing_github_comments' });
  assert.notOk(page.progressBar.hasError, 'Progress bar has no error state.');
});

test('it renders a solid blue icon for non-error states', function(assert) {
  renderPage();
  this.set('githubRepo', { syncState: 'syncing_github_comments' });
  assert.ok(page.spriteIcon.svg.isSolidBlue, 'Icon is solid blue.');
});

test('it renders an error progress bar for the error states', function(assert) {
  renderPage();
  this.set('githubRepo', { syncState: 'errored_syncing_github_comments' });
  assert.ok(page.progressBar.hasError, 'Progress bar has the error state.');
});

test('it renders a solid red icon for error states', function(assert) {
  renderPage();
  this.set('githubRepo', { syncState: 'errored_syncing_github_comments' });
  assert.ok(page.spriteIcon.svg.isSolidRed, 'Icon is solid red.');
});
