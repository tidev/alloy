const _ = require('lodash');
const { IncrementalFileTask } = require('appc-tasks');
const fs = require('fs');
const path = require('path');
const walkSync = require('walk-sync');

const CONST = require('alloy/Alloy/common/constants');

const viewRegex = new RegExp('\\.' + CONST.FILE_EXT.VIEW + '$');
const controllerRegex = new RegExp('\\.' + CONST.FILE_EXT.CONTROLLER + '$');
const excludeRegex = new RegExp('(?:^|[\\/\\\\])(?:' + CONST.EXCLUDED_FILES.join('|') + ')(?:$|[\\/\\\\])');

/**
 * Task to compile controllers/views and their styles
 */
class MvcCompileTask extends IncrementalFileTask {
	/**
	 * Constructs a new MVC compile task.
	 *
	 * @param {Object} options Configuration object for this task
	 */
	constructor(options) {
		options.name = options.name || 'mvc-compile';
		super(options);

		this.targetPlatform = options.targetPlatform;
		this.restrictionPath = options.restrictionPath;
		this.parseAlloyComponent = options.parseAlloyComponent;

		// Create a regex for determining which platform-specific
		// folders should be used in the compile process
		let filteredPlatforms = _.reject(CONST.PLATFORM_FOLDERS_ALLOY, p => {
			return p === this.targetPlatform;
		});
		filteredPlatforms = _.map(filteredPlatforms, function(p) { return p + '[\\\\\\/]'; });
		this.filterRegex = new RegExp('^(?:(?!' + filteredPlatforms.join('|') + '))');

		this.processed = {};
		this.rawSourceCollections = [];

		if (options.sourceCollections) {
			this.sourceCollections = options.sourceCollections;
		}
	}

	set sourceCollections(sourceCollections) {
		this.inputFiles = new Set();
		this.rawSourceCollections = sourceCollections;
		const candidateSourcePaths = [CONST.DIR.VIEW, CONST.DIR.CONTROLLER];
		_.each(sourceCollections, collection => {
			for (const candidateSourcePath of candidateSourcePaths) {
				var sourcePath = path.join(collection.dir, candidateSourcePath);
				if (!fs.existsSync(sourcePath)) {
					continue;
				}

				_.each(walkSync(sourcePath), componentFilename => {
					componentFilename = path.normalize(componentFilename);
					const componentRegex = candidateSourcePath === CONST.DIR.VIEW ? viewRegex : controllerRegex;
					if (componentRegex.test(componentFilename) && this.filterRegex.test(componentFilename) && !excludeRegex.test(componentFilename)) {
						this.addInputFile(path.join(sourcePath, componentFilename));
					}
				});
			}
		});
	}

	/**
	 * Does a full task run, processing every input file.
	 *
	 * @return {Promise}
	 */
	doFullTaskRun() {
		// @todo make this parallel?
		for (const inputFile of this.inputFiles) {
			this.compileAlloyComponent(inputFile);
		}

		return Promise.resolve();
	}

	/**
	 * Does an incremental task run, processing only changed files.
	 *
	 * @param {Map} changedFiles Map of file paths and their current file state (created, changed, deleted)
	 * @return {Promise}
	 */
	doIncrementalTaskRun(changedFiles) {
		changedFiles.forEach((fileState, filePath) => {
			if (fileState === 'deleted') {
				// @todo delete associated controller, view and styles
			} else {
				const collection = this.findSourceCollection(inputFile);
				const parseAsCotroller = controllerRegex.test(inputFile);
				parseAlloyComponent(view, collection.dir, collection.manifest, parseAsCotroller, restrictionPath);
			}
		});

		return Promise.resolve();
	}

	/**
	 * Finds the source collection a file part of.
	 *
	 * @param {String} filePath Full path to the file for which to look up the source collection.
	 */
	findSourceCollection(filePath) {
		for (const collection of this.rawSourceCollections) {
			if (filePath.startsWith(collection.dir)) {
				return collection;
			}
		}

		throw new Error(`Source collection not found for ${filePath}.`);
	}

	/**
	 * Compiles an Alloy component (controller/view).
	 *
	 * Note that this only needs to be done once for either the view OR the controller.
	 *
	 * @param {*} inputFile
	 */
	compileAlloyComponent(inputFile) {
		const collection = this.findSourceCollection(inputFile);
		const parseAsCotroller = controllerRegex.test(inputFile);
		let relativeComponentPath = inputFile.replace(collection.dir, '');
		relativeComponentPath = relativeComponentPath.replace(new RegExp(`^${path.sep}?(views|controllers)${path.sep}?`), '');

		var relativeComponentPathWithoutExtension = relativeComponentPath.substring(0, relativeComponentPath.lastIndexOf('.'));
		var componentIdentifier = relativeComponentPathWithoutExtension.replace(new RegExp('^' + this.targetPlatform + '[\\/\\\\]'), '');
		var fullComponentIdentifier = path.join(collection.dir, componentIdentifier);
		if (this.processed[fullComponentIdentifier]) {
			return;
		}

		this.logger.info('[' + relativeComponentPath + '] ' + (collection.manifest ? collection.manifest.id +
			' ' : '') + `${parseAsCotroller ? 'controller' : 'view'} processing...`);
		this.parseAlloyComponent(relativeComponentPath, collection.dir, collection.manifest, parseAsCotroller, this.restrictionPath);
		this.processed[fullComponentIdentifier] = true;
	}
}

module.exports = MvcCompileTask;