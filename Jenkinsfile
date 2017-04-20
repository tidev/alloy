#! groovy
library 'pipeline-library'

timestamps() {
	node('(osx || linux) && git && npm-publish') {
		def packageVersion = ''
		def isPR = false

		stage('Checkout') {
			checkout scm

			isPR = env.BRANCH_NAME.startsWith('PR-')
			packageVersion = jsonParse(readFile('package.json'))['version']
			currentBuild.displayName = "#${packageVersion}-${currentBuild.number}"
		}

		nodejs(nodeJSInstallationName: 'node 4.7.3') {
			ansiColor('xterm') {
				timeout(10) {
					stage('Build') {
						sh 'npm install'
						// TODO: Set up using mocha and spit out junit test report XML!
						sh 'npm test'
						fingerprint 'package.json'
						// Don't tag PRs
						if (!isPR) {
							pushGitTag(name: packageVersion, message: "See ${env.BUILD_URL} for more information.", force: true)
						}
					} // stage
				} // timeout

				stage('Security') {
					// Clean up and install only production dependencies
					sh 'rm -rf node_modules/'
					sh 'npm install --production'

					// Scan for NSP and RetireJS warnings
					sh 'npm install nsp'
					sh 'node ./node_modules/.bin/nsp check --output summary --warn-only'
					sh 'npm uninstall nsp'
					sh 'npm prune'

					sh 'npm install retire'
					sh 'node ./node_modules/.bin/retire --exitwith 0'
					sh 'npm uninstall retire'
					sh 'npm prune'

					step([$class: 'WarningsPublisher', canComputeNew: false, canResolveRelativePaths: false, consoleParsers: [[parserName: 'Node Security Project Vulnerabilities'], [parserName: 'RetireJS']], defaultEncoding: '', excludePattern: '', healthy: '', includePattern: '', messagesPattern: '', unHealthy: ''])
				} // stage

				stage('Publish') {
					if (!isPR) {
						sh 'npm publish'
					}
				}

				stage('JIRA') {
					if (!isPR) {
						def versionName = "Alloy ${packageVersion}"
						def projectKey = 'ALOY'
						def issueKeys = jiraIssueSelector(issueSelector: [$class: 'DefaultIssueSelector'])

						// Comment on the affected tickets with build info
						step([
							$class: 'hudson.plugins.jira.JiraIssueUpdater',
							issueSelector: [$class: 'hudson.plugins.jira.selector.DefaultIssueSelector'],
							scm: scm
						])

						// Create the version we need if it doesn't exist...
						step([
							$class: 'hudson.plugins.jira.JiraVersionCreatorBuilder',
							jiraVersion: versionName,
							jiraProjectKey: projectKey
						])

						// Should append the new version to the ticket's fixVersion field
						def fixVersion = [name: versionName]
						for (i = 0; i < issueKeys.size(); i++) {
							def result = jiraGetIssue(idOrKey: issueKeys[i])
							def fixVersions = result.data.fields.fixVersions << fixVersion
							def testIssue = [fields: [fixVersions: fixVersions]]
							jiraEditIssue(idOrKey: issueKeys[i], issue: testIssue)
						}

						// Should release the version
						step([$class: 'JiraReleaseVersionUpdaterBuilder', jiraProjectKey: projectKey, jiraRelease: versionName])
					}
				}
			} // ansiColor
		} //nodejs
	} // node
} // timestamps
