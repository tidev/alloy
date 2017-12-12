#! groovy
library 'pipeline-library'

timestamps() {
	node('(osx || linux) && git && npm-publish && curl') {
		def packageVersion = ''
		def isMaster = false

		stage('Checkout') {
			// checkout scm
			// Hack for JENKINS-37658 - see https://support.cloudbees.com/hc/en-us/articles/226122247-How-to-Customize-Checkout-for-Pipeline-Multibranch
			checkout([
				$class: 'GitSCM',
				branches: scm.branches,
				extensions: scm.extensions + [[$class: 'CleanBeforeCheckout'], [$class: 'CloneOption', honorRefspec: true, noTags: true, reference: '', shallow: true, depth: 30, timeout: 30]],
				userRemoteConfigs: scm.userRemoteConfigs
			])

			isMaster = env.BRANCH_NAME.equals('master')
			packageVersion = jsonParse(readFile('package.json'))['version']
			currentBuild.displayName = "#${packageVersion}-${currentBuild.number}"
		}

		nodejs(nodeJSInstallationName: 'node 4.7.3') {
			ansiColor('xterm') {
				timeout(55) {
					stage('Build') {
						// Make sure we use npm 5.2, 5.3 has a bug with pruning to production
						sh 'npm install -g npm@5.2'

						sh 'npm install'
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
					sh 'npm prune --production'

					// Scan for NSP and RetireJS warnings
					sh 'npm i nsp'
					sh 'node ./node_modules/.bin/nsp check --output summary --warn-only'

					sh 'npm i retire'
					sh 'node ./node_modules/.bin/retire --exitwith 0'

					step([$class: 'WarningsPublisher', canComputeNew: false, canResolveRelativePaths: false, consoleParsers: [[parserName: 'Node Security Project Vulnerabilities'], [parserName: 'RetireJS']], defaultEncoding: '', excludePattern: '', healthy: '', includePattern: '', messagesPattern: '', unHealthy: ''])
				} // stage

				stage('Publish') {
					if (!isMaster) {
						// First try to publish to NPM registry...
						sh 'npm publish'
						// Tag if npm publish was successful
						pushGitTag(name: packageVersion, message: "See ${env.BUILD_URL} for more information.", force: true)
						// Trigger appc-cli-wrapper job
						build job: 'appc-cli-wrapper', wait: false
					}
				}

				stage('JIRA') {
					if (!isMaster) {
						// if we were able to publish to NPM and tag, then update JIRA
						updateJIRA('ALOY', "Alloy ${packageVersion}", scm)
					}
				}
			} // ansiColor
		} //nodejs
	} // node
} // timestamps
