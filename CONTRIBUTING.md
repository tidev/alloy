# Contributing to Alloy


## Releasing

To release a new version of Alloy, please do the following:

1. Ensure all changes you want in the release are merged
2. Create a pull request that does the following:
   1. Updates the [changelog](./CHANGELOG.md) for the release
   2. Bumps the version in the package.json/package-lock.json as required
3. Once that pull request is merged, [create a new release](https://github.com/tidev/alloy/releases/new) and GitHub actions will publish the new version
