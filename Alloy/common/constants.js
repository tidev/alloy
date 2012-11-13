var _ = require('../lib/alloy/underscore')._;

exports.ALLOY_DIR = 'app';
exports.NAME_DEFAULT = 'index';
exports.NAME_WIDGET_DEFAULT = 'widget';
exports.GLOBAL_STYLE = 'app.tss';
exports.ROOT_NODE = 'Alloy';
exports.NAMESPACE_DEFAULT = 'Ti.UI';
exports.REQUIRE_TYPE_DEFAULT = 'view';
exports.PLUGIN_NAME = 'ti.alloy';


exports.BIND_COLLECTION = 'dataCollection';
exports.BIND_WHERE = 'dataFilter';
exports.BIND_TRANSFORM = 'dataTransform';
exports.BIND_TRANSFORM_VAR = '__transform';
exports.BIND_MODEL_VAR = '$model';

exports.EXPR_PREFIX = '#';

exports.PLATFORM_FOLDERS = ['android','iphone','mobileweb'];
exports.PLATFORM_FOLDERS_ALLOY = ['android','ios','mobileweb'];
exports.INSTALL_TYPES = ['plugin'];
exports.GENERATE_TARGETS = ['controller', 'jmk', 'model', 'migration', 'view', 'widget'];

exports.FILE_EXT = {
	VIEW: 'xml',
	STYLE: 'tss',
	MODEL: 'js',
	MODELCODE: 'js',
	MIGRATION: 'js',
	CONTROLLER: 'js',
	COMPONENT: 'js',
	CONFIG: 'json',
	JMK: 'jmk'
};

exports.DIR = {
	VIEW: 'views',
	STYLE: 'styles',
	CONTROLLER: 'controllers',
	MODEL: 'models',
	MODELCODE: 'models',
	MIGRATION: 'migrations',
	CONFIG: 'config',
	ASSETS: 'assets',
	WIDGET: 'widgets',
	LIB: 'lib',
	COMPONENT: 'controllers'
};

exports.JS_RESERVED = [
	'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete',
	'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof',
	'new', 'return', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
	'void', 'while', 'with'
];
exports.JS_RESERVED_FUTURE = [
	'class', 'enum', 'export', 'extends', 'import', 'super', 'implements',
	'interface', 'let', 'package', 'private', 'protected', 'public',
	'static', 'yield'
];
exports.JS_RESERVED_ALL = _.union(exports.JS_RESERVED, exports.JS_RESERVED_FUTURE);