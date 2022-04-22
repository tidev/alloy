#! groovy
library 'pipeline-library'
def nodeVersion = '16.11.1'
def npmVersion = 'latest' // We can change this without any changes to Jenkins. 5.7.1 is minimum to use 'npm ci'

def packageVersion = ''
def isPR = env.BRANCH_NAME.startsWith('PR-')
def runDanger = isPR

def MAINLINE_BRANCH_REGEXP = /master|next|\d_\d+_(X|\d)/ // a branch is considered mainline if 'master' or like 1_13_X
def isMainlineBranch = (env.BRANCH_NAME ==~ MAINLINE_BRANCH_REGEXP)
def isMaster = 'master'.equals(env.BRANCH_NAME)

def unitTests(titaniumBranch, nodeVersion, npmVersion) {
	checkout scm
	nodejs(nodeJSInstallationName: "node ${nodeVersion}") {
		ansiColor('xterm') {
			timeout(55) {
				ensureNPM(npmVersion)
				sh 'npm ci'

				// Install titanium cli
				ensureNPMPackageVersion('titanium')

				// Install titanium SDK and select it
				if ('GA'.equals(titaniumBranch)) {
					sh 'ti sdk install latest -d'
				} else if ('master'.equals(titaniumBranch)) {
					sh 'ti sdk install -b master -d'
				}
				try {
					withEnv(["PATH+ALLOY=${pwd()}/bin"]) {
						sh 'npm test'
					}
				} finally {
					junit 'TEST-*.xml'
					stash includes: 'TEST-*.xml', name: "test-report-${titaniumBranch}"
				}
			} // timeout
		} // ansi
	} // nodejs
	deleteDir()
}

timestamps() {
	try {
		node('(osx || linux) && git && !master') {
			stage('Lint') {
				checkout scm

				packageVersion = jsonParse(readFile('package.json'))['version']
				currentBuild.displayName = "#${packageVersion}-${currentBuild.number}"
				fingerprint 'package.json'

				if (skipCI()) {
					def msg = 'Last commit tagged [skip ci]. Skipping build'
					manager.addShortText(msg)
					currentBuild.result = 'ABORTED'
					error(msg)
				}

				nodejs(nodeJSInstallationName: "node ${nodeVersion}") {
					ensureNPM(npmVersion)
					// Install dependencies
					timeout(5) {
						sh 'npm ci'
					}
					sh 'npm run lint'
				} // nodejs
				stash includes: 'package.json,package-lock.json', name: 'security'
			} // stage('Lint')
		} // node

		stage('Test') {
			parallel(
				'GA SDK': {
					node('(osx || linux) && git && !master') {
						unitTests('GA', nodeVersion, npmVersion)
					}
				},
				'master SDK': {
					node('(osx || linux) && git && !master') {
						unitTests('master', nodeVersion, npmVersion)
					}
				}
			)
		}

		node('(osx || linux) && git && !master') {
			stage('Security') {
				unstash 'security'
				nodejs(nodeJSInstallationName: "node ${nodeVersion}") {
					npmAuditToWarnings() // runs npm audit --json, converts to format needed by scanner and writes to npm-audit.json file
					recordIssues blameDisabled: true, enabledForFailure: true, forensicsDisabled: true, tools: [issues(name: 'NPM Audit', pattern: 'npm-audit.json')]
				} // nodejs
				deleteDir()
			} // stage
		} // node

		node('(osx || linux) && git && npm-publish && !master') {
			stage('Publish') {
				checkout scm
				nodejs(nodeJSInstallationName: "node ${nodeVersion}") {
					if (isMainlineBranch) {
						try {
							ensureNPM(npmVersion)
							sh 'npm ci'
							withCredentials([string(credentialsId: 'oauth-github-api', variable: 'GH_TOKEN')]) {
								sh 'npm run release'
							}

							// reread the package.json to detect version change if we've published
							packageVersion = jsonParse(readFile('package.json'))['version']
							currentBuild.displayName = "#${packageVersion}-${currentBuild.number}"

							if (isMaster) {
								// Trigger appc-cli job
								build job: '../appc-cli/master', wait: false, parameters: [ 
									[$class: 'StringParameterValue', name: 'packageName', value: 'alloy' ],
									[$class: 'StringParameterValue', name: 'packageVersion', value: packageVersion ],
								]
							}

							// Update tickets
							updateJIRA('ALOY', "Alloy ${packageVersion}", scm)
						} catch (e) {
							// Don't thow the errors as we don't want a failed publish due to the version not being bumped
							// being classed as a failure on the build
						}
					} // if
				} // nodejs
				deleteDir()
			} // stage
		} // node
	} finally {
		if (runDanger) {
			stage('Danger') {
				node('(osx || linux) && !master') {
					nodejs(nodeJSInstallationName: "node ${nodeVersion}") {
						checkout scm
						try {
							unstash 'test-report-master'
						} catch (e) {}
						try {
							unstash 'test-report-GA'
						} catch (e) {}
						ensureNPM(npmVersion)
						timeout(5) {
							sh 'npm ci'
						}
						withEnv(["DANGER_JS_APP_INSTALL_ID=''"]) {
							sh returnStatus: true, script: 'npx danger ci --verbose'
						} // withEnv
					} // nodejs
					deleteDir()
				} // node
			} // stage
		} // if
	}
} // timestamps
