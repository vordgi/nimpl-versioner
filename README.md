# @nimpl/versioner

A package for versioning your next.js application.

What it will do:

1. Clones the entire contents of the `src` directory (*except pages*) for your specified versions to the `src/versions/<VERSION>/*` directory;
1. Clones all pages for your specified versions from the `src/pages` path to the `src/pages/versions/<VERSION>/*` directory;
1. Clones all pages for your specified versions from the `src/app` path to the `src/app/versions/<VERSION>/*` directory;
1. Updates the import paths from src to versioned for pages.

## Notes

At the moment, the package does not cover all needs.

For example: it does not update the link hrefs to versioned pages, works with files inside src and does not know how to update dynamic imports to versioned.

Overall, this is more of an experiment to see how versioning can be done in a next.js application. If you think this approach is viable - please star it and write about your ideas or wishes in the package's issues or discussions.

In general, I would prefer the build in different branches and subsequent deployment to subdomains. If in your case there is a need for all versions as a single application - please also tell about your case. All your ideas will definitely be processed and thought over!

## Usage

**Install package globally:**
```bash
npm i @nimpl/versioner -g
```

**Run package:**
```bash
versioner
```

## Configuration

Before launching the package, you need to set up the configuration. For this, create a `versioner.config.js` file at the root of your next.js application.

Example of a file:
```js
module.exports = {
    git: {
        token: "example-git-token",
        userName: "vordgi",
        projectName: "nimpl-docs",
    },
    versionsDir: "versions",
    versions: [
        {
            ref: "ea9ec25870071d1cfa0ea83121a3a5979fa34baa",
            version: "0.1.3",
        },
    ],
    aliases: {
        "@/*": ["./src/*"],
    },
};
```

`git.token` - [personal access token](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api#authenticating-with-a-personal-access-token) for the github project;
`git.userName` and `git.project` - user name and project key in github;
`versionsDir` - the subpath into which versions will be recorded;
`versions` - the list of versions for which files need to be cloned;
`versions[number].ref` - the commit hash or branch of the required version;
`versions[number].version` - version key, by which files will be saved;
`aliases` - object of aliases for automatic import replacement.

## License

[MIT](https://github.com/vordgi/nimpl-versioner/blob/main/LICENSE)
