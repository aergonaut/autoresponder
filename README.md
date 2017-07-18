# Autoresponder

This is a GitHub Integration built with [probot](https://github.com/probot/probot) that automatically replies to opened GitHub issues with the contents of `.github/ISSUE_REPLY_TEMPLATE.md`.

![](https://cloud.githubusercontent.com/assets/173/23834371/788d330e-0723-11e7-9e71-81d77c01267d.png)

## Configuration

A `.github/autoresponder.yml` file can be used to specify configuration options for the bot.

```yml
# Use the ignore key to specify when the bot should ignore a new issue
ignore:
  # Ignore issues from specific users
  users:
    - octocat
  # Ignore issues from users who are collaborators
  collaborators: true
```

See [docs/deploy.md](docs/deploy.md) if you would like to run your own instance of this plugin.
