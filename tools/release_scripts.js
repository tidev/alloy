var fs = require('fs'),
	spawn = require('child_process').spawn,
	path = require('path'),

	program = require('commander'),
	async = require('async'),

	pkgPath = path.join(__dirname, '..', 'package.json'),
	pkg = JSON.parse(fs.readFileSync(pkgPath)),

	nodeAppcVersion = pkg.dependencies && pkg.dependencies['node-appc'],

	APPCELERATOR_REMOTE_NAME = 'appcelerator',

	startTime = Date.now();

// Validate the arguments
program.version('0.0.1')
	.option('--non-interactive', 'disables prompting for values')
	.option('-s, --silent', 'does not print anything to the console and disables prompting')
	.parse(process.argv);

if (!program.silent && !program.nonInteractive) {
	program.confirm('\nPublish version ' + pkg.version + ' of ' + pkg.name +
			(nodeAppcVersion ? ' against node-appc version ' + nodeAppcVersion : '') +
			' [y/n]? ', function(ok){
		if (ok) {
			publish();
		} else {
			console.log('');
			process.exit(1);
		}
	});
} else {
	publish();
}

function publish() {

	var STATE_NONE = 0,
		STATE_REPO_TAGGED = 2,
		STATE_REPO_PUSHED = 3,
		STATE_NPM_PUBLISHED = 4,
		STATE_NPM_VERIFIED = 5,
		state = STATE_NONE,
		step = 1,
		tasks;

	function getStep() {
		return '(' + (step++) + '/' + tasks.length + ')';
	}

	// Create the tasks
	tasks = [

		// Tag the release in git with an annotated tag
		function (next) {
			console.log('\n* Tagging release in git ' + getStep());
			spawn('git', ['tag', '-a', pkg.version, '-m', 'Tagged the ' + pkg.version + ' release'], {
				stdio: 'inherit'
			}).on('exit', function (code) {
				if (code) {
					next(code);
				} else {
					state = STATE_REPO_TAGGED;
					next();
				}
			});
		},

		// Push the tag to github
		function (next) {
			console.log('\n* Pushing tag to GitHub ' + getStep());
			spawn('git', ['push', APPCELERATOR_REMOTE_NAME, pkg.version], {
				stdio: 'inherit'
			}).on('exit', function (code) {
				if (code) {
					next(code);
				} else {
					state = STATE_REPO_PUSHED;
					next();
				}
			});
		},

		// Publish the npm package
		function (next) {
			console.log('\n* Publishing to NPM ' + getStep());
			spawn('npm', ['publish'], {
				stdio: 'inherit',
				cwd: path.join(__dirname, '..')
			}).on('exit', function (code) {
				if (code) {
					next(code);
				} else {
					state = STATE_NPM_PUBLISHED;
					next();
				}
			});
		},

		// Verify that the package was published correctly
		function (next) {
			console.log('\n* Verifying published package ' + getStep());
			var info = spawn('npm', ['info', pkg.name, '--json']),
				stderrData = '',
				stdoutData = '';
			info.stdout.on('data', function (data) {
				stdoutData += data.toString();
			});
			info.stderr.on('data', function (data) {
				stderrData += data.toString();
			});
			info.on('exit', function (code) {
				if (code) {
					console.warn('\n  warning: could not verify that the package was published properly.\n' +
						'             You should verify manually by calling "npm info ' + pkg.name + '".\n');
					next();
				} else {
					var infoResult = JSON.parse(stdoutData);
					if (infoResult['dist-tags'].latest !== pkg.version) {
						console.error('\n  error: Something has gone wrong, the published version isn\'t showing up in NPM as latest\n');
						next(1);
					} else {
						next();
					}
				}
			});
			state = STATE_NPM_VERIFIED;
		}
	];
	async.series(tasks, function (err) {

		// Time to exit
		if (err) {
			console.error('\n' + pkg.name + ' WAS NOT properly published!');
		}
		console.log('\nProcessing completed in ' + ((Date.now() - startTime) / 1000).toFixed(1) + ' seconds\n');
		process.exit(err ? 1 : 0);
	});
}