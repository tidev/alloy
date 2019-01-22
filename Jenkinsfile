#! groovy
library 'pipeline-library'
def nodeVersion = '8.9.0'
def npmVersion = '5.7.1' // We can change this without any changes to Jenkins. 5.7.1 is minimum to use 'npm ci'

timestamps() {
	node('(osx || linux) && git && npm-publish && curl') {
		def packageVersion = ''
		def isPR = false
		def published = false

		stage('Checkout') {
			// checkout scm
			// Hack for JENKINS-37658 - see https://support.cloudbees.com/hc/en-us/articles/226122247-How-to-Customize-Checkout-for-Pipeline-Multibranch
			checkout([
				$class: 'GitSCM',
				branches: scm.branches,
				extensions: scm.extensions + [[$class: 'CleanBeforeCheckout'], [$class: 'CloneOption', honorRefspec: true, noTags: true, reference: '', shallow: true, depth: 30, timeout: 30]],
				userRemoteConfigs: scm.userRemoteConfigs
			])

			isPR = env.BRANCH_NAME.startsWith('PR-')
			packageVersion = jsonParse(readFile('package.json'))['version']
			currentBuild.displayName = "#${packageVersion}-${currentBuild.number}"
		}

		nodejs(nodeJSInstallationName: "node ${nodeVersion}") {
			ansiColor('xterm') {
				timeout(55) {
					stage('Build') {
						ensureNPM(npmVersion)
						// Install yarn if not installed
						sh 'npm ci'
						if (sh(returnStatus: true, script: 'which ti') != 0) {
							// Install titanium
							sh 'npm install -g titanium'
						}
						if (sh(returnStatus: true, script: 'ti config sdk.selected') != 0) {
							// Install titanium SDK and select it
							sh 'ti sdk install -d'
						}
						try {
							withEnv(["PATH+ALLOY=${pwd()}/bin"]) {
								sh 'npm test'
							}
						} finally {
							junit 'TEST-*.xml'
						}
						fingerprint 'package.json'
					} // stage
				} // timeout

				stage('Security') {
					// Clean up and install only production dependencies
					ensureNPM(npmVersion)
					sh 'npm ci --production'

					sh 'npx nsp check --output summary --warn-only'

					sh 'npx retire --exitwith 0'

					step([$class: 'WarningsPublisher', canComputeNew: false, canResolveRelativePaths: false, consoleParsers: [[parserName: 'Node Security Project Vulnerabilities'], [parserName: 'RetireJS']], defaultEncoding: '', excludePattern: '', healthy: '', includePattern: '', messagesPattern: '', unHealthy: ''])
				} // stage

				stage('Publish') {
					if (!isPR) {
						try {
							// Publish
							sh 'npm publish'
							// Tag git
							pushGitTag(name: packageVersion, message: "See ${env.BUILD_URL} for more information.", force: true)
							// Trigger appc-cli job
							build job: '../appc-cli/master', wait: false
							// Set published to true so we can update tickets
							published = true
						} catch (e) {
							// Don't thow the errors as we don't want a failed publish due to the version not being bumped
							// being classed as a failure on the build
						}
					}
				}

				stage('JIRA') {
					if (published) {
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
