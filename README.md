# bumperbot

Automatically bump your version number in a WordPress plugin repo. The name of your plugin's entry point must match the repo name (e.g. a `my-plugin` repo should have a `my-plugin.php` file in its root), and you must use [semver](https://semver.org).

You must manually set up labels on your repos matching the following:

+ `bump: patch`
+ `bump: minor`
+ `bump: major`
+ `bump: [any other valid semver increment level]` [(see here)](https://github.com/npm/node-semver)

When a PR has one of these labels, and is merged, bumperbot will automatically push a new commit updating the version number.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## License & Conduct

This project is licensed under the terms of the MIT License, included in `LICENSE.md`.

All of my open source projects follow a strict code of conduct, included in `CODE_OF_CONDUCT.md`. I ask that all contributors adhere to the standards and guidelines in that document.

Thank you!
