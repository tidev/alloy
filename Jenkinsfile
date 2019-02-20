#! groovy
library 'pipeline-library'
def nodeVersion = '8.9.0'
def npmVersion = '6.8.0' // We can change this without any changes to Jenkins. 5.7.1 is minimum to use 'npm ci'

def packageVersion = ''
def isPR = false
def runDanger = isPR

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
				
				fingerprint 'package.json'
			} // timeout
		} // ansi
	} // nodejs
}

timestamps() {
	try {
		node('(osx || linux) && git ') {
			stage('Lint') {
				checkout scm

				isPR = env.BRANCH_NAME.startsWith('PR-')
				packageVersion = jsonParse(readFile('package.json'))['version']
				currentBuild.displayName = "#${packageVersion}-${currentBuild.number}"

				nodejs(nodeJSInstallationName: "node ${nodeVersion}") {
					ensureNPM(npmVersion)
					// Install dependencies
					timeout(5) {
						sh 'npm ci'
					}
					// Run npm test, but record output in a file and check for failure of command by checking output
					if (fileExists('npm_test.log')) {
						sh 'rm -rf npm_test.log'
					}
					def npmTestResult = sh(returnStatus: true, script: 'npm run lint &> npm_test.log')
					if (runDanger) { // Stash files for danger.js later
						stash includes: 'package.json,package-lock.json,dangerfile.js,.eslintignore,.eslintrc,npm_test.log', name: 'danger'
					}
					if (npmTestResult != 0) {
						error readFile('npm_test.log')
					}
				} // nodejs
			} // stage('Lint')
		} // node

		stage('Test') {
			parallel(
				'GA SDK': {
					node('(osx || linux) && git ') {
						unitTests('GA', nodeVersion, npmVersion)
					}
				},
				'master SDK': {
					node('(osx || linux) && git ') {
						unitTests('master', nodeVersion, npmVersion)

					}
				}
			)
		}

		node('(osx || linux) && git ') {
			stage('Security') {
				checkout scm
				nodejs(nodeJSInstallationName: "node ${nodeVersion}") {
					// Install only production dependencies
					ensureNPM(npmVersion)
					sh 'npm ci --production'

					sh 'npx nsp check --output summary --warn-only'

					sh 'npx retire --exitwith 0'

					step([$class: 'WarningsPublisher', canComputeNew: false, canResolveRelativePaths: false, consoleParsers: [[parserName: 'Node Security Project Vulnerabilities'], [parserName: 'RetireJS']], defaultEncoding: '', excludePattern: '', healthy: '', includePattern: '', messagesPattern: '', unHealthy: ''])
				} // nodejs
			} // stage
		} // node

		node('(osx || linux) && git && npm-publish') {
			stage('Publish') {
				checkout scm
				nodejs(nodeJSInstallationName: "node ${nodeVersion}") {
					if (!isPR) {
						try {
							// Publish
							sh 'npm publish'

							// Tag git
							pushGitTag(name: packageVersion, message: "See ${env.BUILD_URL} for more information.", force: true)

							// Trigger appc-cli job
							build job: '../appc-cli/master', wait: false, parameters: [ 
								[$class: 'StringParameterValue', name: 'packageName', value: 'alloy' ],
								[$class: 'StringParameterValue', name: 'packageVersion', value: packageVersion ],
							]
							// Update tickets
							updateJIRA('ALOY', "Alloy ${packageVersion}", scm)
						} catch (e) {
							// Don't thow the errors as we don't want a failed publish due to the version not being bumped
							// being classed as a failure on the build
						}
					} // if
				} // nodejs
			} // stage
		} // node
	} finally {
		if (runDanger) {
			stage('Danger') {
				node('osx || linux') {
					nodejs(nodeJSInstallationName: "node ${nodeVersion}") {
						unstash 'danger'
						try {
							unstash 'test-report-master'
						} catch (e) {}
						try {
							unstash 'test-report-GA'
						} catch (e) {}
						ensureNPM(npmVersion)
						sh 'npm ci'
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
