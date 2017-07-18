const yaml = require('js-yaml');

async function getConfig(context) {
  let config;
  try {
    const options = context.repo({path: '.github/autoresponder.yml'});
    const res = await context.github.repos.getContent(options);
    config = yaml.load(new Buffer(res.data.content, 'base64').toString()) || {};
  } catch (err) {
    config = {};
  }
  return config;
}

async function shouldSkipIssueFromSender(sender, context, config) {
  if (typeof config.ignore !== 'undefined') {
    // Ignore specific users
    if (typeof config.ignore.users !== 'undefined') {
      if (config.ignore.users.indexOf(sender) !== -1) {
        return true;
      }
    }

    // Ignore collaborators
    if (
      typeof config.ignore.collaborators !== 'undefined' &&
      config.ignore.collaborators == true
    ) {
      const options = context.repo({username: sender});
      const isCollaborator = await context.github.checkCollaborator(options);
      if (isCollaborator) {
        return true;
      }
    }
  }

  return false;
}

module.exports = robot => {
  robot.on('issues.opened', async context => {
    const config = getConfig(context);

    const senderLogin = context.event.payload.sender.login;
    if (shouldSkipIssueFromSender(senderLogin, context, config)) {
      return;
    }

    const options = context.repo({path: '.github/ISSUE_REPLY_TEMPLATE.md'});
    const res = await context.github.repos.getContent(options);
    const template = new Buffer(res.data.content, 'base64').toString();

    return context.github.issues.createComment(context.issue({body: template}));
  });
};
