var fs = require('fs'),
	os = require('os'),
	path = require('path'),
	spawnSync = require('child_process').spawnSync;

describe('alloy purgetss deprecation', function() {
	var directory, callsFile, outputFile;

	beforeEach(function() {
		directory = fs.mkdtempSync(path.join(os.tmpdir(), 'alloy-purgetss-'));
		callsFile = path.join(directory, 'calls.jsonl');
		outputFile = path.join(directory, 'output.txt');
		var script = path.join(directory, 'fake-purgetss.js');
		fs.writeFileSync(script, '#!' + process.execPath + '\n' +
			'const fs = require("fs");\n' +
			'fs.appendFileSync(process.env.PURGETSS_TEST_CALLS, JSON.stringify(process.argv.slice(2)) + "\\n");\n' +
			'console.log("PurgeTSS test executable ran");\n');
		if (process.platform === 'win32') {
			fs.writeFileSync(path.join(directory, 'purgetss.cmd'), '@"' + process.execPath + '" "' + script + '" %*\r\n');
		} else {
			fs.copyFileSync(script, path.join(directory, 'purgetss'));
			fs.chmodSync(path.join(directory, 'purgetss'), 0o755);
		}
	});

	afterEach(function() {
		fs.rmSync(directory, { recursive: true, force: true });
	});

	function run(args) {
		var descriptor = fs.openSync(outputFile, 'w');
		var result;
		try {
			result = spawnSync(process.execPath, [path.resolve(__dirname, '../../bin/alloy'), '-n'].concat(args), {
				cwd: directory,
				env: Object.assign({}, process.env, { PATH: directory, PURGETSS_TEST_CALLS: callsFile }),
				stdio: ['ignore', descriptor, descriptor],
				timeout: 5000
			});
		} finally {
			fs.closeSync(descriptor);
		}
		expect(result.error).toBeUndefined();
		expect(result.status).toBe(0);
		return fs.readFileSync(outputFile, 'utf8');
	}

	[
		{ args: [], forwarded: [] },
		{ args: ['build'], forwarded: ['build'] }
	].forEach(function(testCase) {
		it('warns before forwarding ' + (testCase.args[0] || 'the default command'), function() {
			var output = run(['purgetss'].concat(testCase.args));
			expect(output).toMatch(/alloy purgetss.*deprecated/i);
			expect(output).toMatch(/purgetss --help/);
			expect(output.indexOf('deprecated')).toBeLessThan(output.indexOf('PurgeTSS test executable ran'));
			var calls = fs.readFileSync(callsFile, 'utf8').trim().split('\n').map(JSON.parse);
			expect(calls).toEqual([testCase.forwarded]);
		});
	});

	it('marks the shortcut deprecated in the command list', function() {
		var output = run(['--help']);
		expect(output).toMatch(/purgetss[^\n]*[Dd]eprecated/);
		expect(fs.existsSync(callsFile)).toBe(false);
	});

	it('directs command help to the standalone CLI without running it', function() {
		var output = run(['purgetss', '--help']);
		expect(output).toMatch(/deprecated/i);
		expect(output).toMatch(/purgetss --help/);
		expect(fs.existsSync(callsFile)).toBe(false);
	});
});
