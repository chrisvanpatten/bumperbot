const Base64 = require('js-base64').Base64
const wpGetFileData = require('@martin-pettersson/wp-get-file-data')
const lodash = require('lodash')
const semver = require('semver')

module.exports = app => {
  app.on(['pull_request.closed'], async context => {
    if (context.payload.pull_request.merged === false) {
      return
    }

    // Get some info about the repo
    const owner  = context.payload.repository.owner.login
    const repo   = context.payload.repository.name
    const path   = context.payload.repository.name + '.php'
    const labels = context.payload.pull_request.labels

    // Get the bump label
    const bumpLabel = lodash.find(labels, function (obj) {
      return lodash.startsWith(obj.name, 'bump: ')
    })

    // Return early if this PR doesn't have a bump label
    if (typeof bumpLabel === 'undefined') {
      return
    }

    // Get the actual bump level string
    const bump = lodash.split(bumpLabel.name, 'bump: ')[1]

    // Fetch the main plugin file
    context.github.repos.getContents({owner, repo, path})
      .then(result => {
        // Decode the result
        const content = Base64.decode(result.data.content)
        const shaHash = result.data.sha

        // Get the file data
        const data = wpGetFileData.getMatchedFields(content)

        // Version and next version
        const currentVersion = data.Version
        const nextVersion    = semver.inc(currentVersion, bump)

        // Replace the version string
        const newContent = Base64.encode(lodash.replace(
          content,
          `Version: ${currentVersion}`,
          `Version: ${nextVersion}`
        ))

        // Update the file
        return context.github.repos.updateFile({
          owner,
          repo,
          path,
          message: `Updating ${currentVersion} to ${nextVersion}`,
          content: newContent,
          sha: shaHash,
        })
      })
  })
}
