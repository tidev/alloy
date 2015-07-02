var isTitanium = typeof Titanium !== 'undefined';
var _, generatePlatformArray;

if (isTitanium) {
	_ = require('alloy/underscore')._;
} else {
	var platforms = require('../../platforms/index');
	_ = require('../lib/alloy/underscore')._;

	// iterate through supported platforms to create specific constants
	generatePlatformArray = function(key) {
		var ret = [];
		_.each(_.keys(platforms), function(p) {
			ret.push(platforms[p][key]);
		});
		return ret;
	};

	// generate compile time constants based on supported platforms
	exports.PLATFORMS = generatePlatformArray('platform');
	exports.PLATFORM_FOLDERS_ALLOY = generatePlatformArray('alloyFolder');
	exports.PLATFORM_FOLDERS = generatePlatformArray('titaniumFolder');
}

// General default values
exports.ALLOY_DIR = 'app';
exports.ALLOY_RUNTIME_DIR = 'alloy';
exports.RESOURCES_DIR = 'Resources';
exports.NAME_DEFAULT = 'index';
exports.NAME_WIDGET_DEFAULT = 'widget';
exports.GLOBAL_STYLE = 'app.tss';
exports.ROOT_NODE = 'Alloy';
exports.NAMESPACE_DEFAULT = 'Ti.UI';
exports.REQUIRE_TYPE_DEFAULT = 'view';
exports.PLUGIN_NAME = 'ti.alloy';
exports.EXPR_PREFIX = '#';
exports.PLUGIN_FILE = 'plugin.py';
exports.HOOK_FILE = 'alloy.js';
exports.HOOK_FILE_CLEAN = 'deepclean.js';
exports.MINIMUM_TI_SDK = '3.0.0';
exports.ITEM_TEMPLATE_VAR = '__itemTemplate';
exports.PARENT_SYMBOL_VAR = '__parentSymbol';
exports.WIDGET_OBJECT = 'Widget';
exports.SKIP_EVENT_HANDLING = ['Ti.UI.ListItem','Alloy.Abstract.ItemTemplate'];
exports.ADAPTERS = ['localStorage', 'properties', 'sql'];
exports.CONTROLLER_NODES = ['Alloy.Require', 'Alloy.Widget'];
exports.DEFAULT_BACKBONE_VERSION = '0.9.2';
exports.SUPPORTED_BACKBONE_VERSIONS = ['0.9.2', '1.1.2'];

// property names
exports.CLASS_PROPERTY = 'classes';
exports.APINAME_PROPERTY = 'apiName';
exports.AUTOSTYLE_PROPERTY = 'autoStyle';
exports.DOCROOT_MODULE_PROPERTY = "module";

// Constants related to model-view binding
exports.BIND_PROPERTIES = ['dataCollection','dataFilter','dataTransform','dataFunction'];
exports.BIND_COLLECTION = 'dataCollection';
exports.BIND_WHERE = 'dataFilter';
exports.BIND_TRANSFORM = 'dataTransform';
exports.BIND_FUNCTION = 'dataFunction';
exports.BIND_TRANSFORM_VAR = '__transform';
exports.BIND_MODEL_VAR = '$model';
exports.MODEL_ELEMENTS = ['Alloy.Collection','Alloy.Model'];
exports.MODEL_BINDING_EVENTS = 'fetch change destroy';
exports.COLLECTION_BINDING_EVENTS = 'fetch destroy change add remove reset';

// Listings for supported platforms and commands
exports.INSTALL_TYPES = ['plugin'];
exports.GENERATE_TARGETS = ['controller', 'jmk', 'model', 'migration', 'view', 'widget', 'style'];
exports.DEPLOY_TYPES = [
	{ key: 'ENV_DEV', value: 'development' },
	{ key: 'ENV_DEVELOPMENT', value: 'development' },
	{ key: 'ENV_TEST', value: 'test' },
	{ key: 'ENV_PROD', value: 'production' },
	{ key: 'ENV_PRODUCTION', value: 'production' }
];
exports.DIST_TYPES = [
	{ key: 'DIST_ADHOC', value: ['dist-adhoc'] },
	{ key: 'DIST_STORE', value: ['dist-appstore', 'dist-playstore'] }
];

// mappings of file extensions and folders for each file type
exports.FILE_EXT = {
	VIEW: 'xml',
	STYLE: 'tss',
	MODEL: 'js',
	MODELCODE: 'js',
	MIGRATION: 'js',
	CONTROLLER: 'js',
	COMPONENT: 'js',
	CONFIG: 'json',
	JMK: 'jmk',
	MAP: 'map'
};
exports.DIR = {
	VIEW: 'views',
	STYLE: 'styles',
	RUNTIME_STYLE: 'styles',
	CONTROLLER: 'controllers',
	MODEL: 'models',
	MODELCODE: 'models',
	MIGRATION: 'migrations',
	CONFIG: 'config',
	ASSETS: 'assets',
	WIDGET: 'widgets',
	LIB: 'lib',
	COMPONENT: 'controllers',
	MAP: 'build/map',
	VENDOR: 'vendor',
	THEME: 'themes',
	BUILD: 'build/alloy',
	I18N: 'i18n',
	PLATFORM: 'platform',
	BUILD_I18N: 'build/i18n',
	BUILD_PLATFORM: 'build/platform'
};
// folders/files to exclude when copying and processing files
// RegEx format: must escape special chars - so use \.svn not .svn
exports.EXCLUDED_FILES = [
	'\\.svn','\\.git'
];

// constants identifying JS reserved words
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

// constants for implicit namespaces in markup
var NS_ALLOY = 'Alloy',
	NS_ALLOY_ABSTRACT = 'Alloy.Abstract',
	NS_TI_ANDROID = 'Ti.Android',
	NS_TI_MAP = 'Ti.Map',
	NS_TI_MEDIA = 'Ti.Media',
	NS_TI_UI_IOS = 'Ti.UI.iOS',
	NS_TI_UI_IPAD = 'Ti.UI.iPad',
	NS_TI_UI_IPHONE = 'Ti.UI.iPhone',
	NS_TI_UI_MOBILEWEB = 'Ti.UI.MobileWeb',
	NS_TI_UI_WINDOWS = 'Ti.UI.Windows';

exports.IMPLICIT_NAMESPACES = {
	// Alloy
	Collection: NS_ALLOY,
	Model: NS_ALLOY,
	Module: NS_ALLOY,
	Require: NS_ALLOY,
	Widget: NS_ALLOY,

	// Alloy.Abstract
	ButtonNames: NS_ALLOY_ABSTRACT,
	ButtonName: NS_ALLOY_ABSTRACT,
	BarItemTypes: NS_ALLOY_ABSTRACT,
	BarItemType: NS_ALLOY_ABSTRACT,
	CoverFlowImageTypes: NS_ALLOY_ABSTRACT,
	CoverFlowImageType: NS_ALLOY_ABSTRACT,
	FlexSpace: NS_ALLOY_ABSTRACT,
	FixedSpace: NS_ALLOY_ABSTRACT,
	Images: NS_ALLOY_ABSTRACT,
	Item: NS_ALLOY_ABSTRACT,
	Items: NS_ALLOY_ABSTRACT,
	ItemTemplate: NS_ALLOY_ABSTRACT,
	Labels: NS_ALLOY_ABSTRACT,
	Option: NS_ALLOY_ABSTRACT,
	Options: NS_ALLOY_ABSTRACT,
	Templates: NS_ALLOY_ABSTRACT,

	// Ti.Android
	Menu: NS_TI_ANDROID,
	MenuItem: NS_TI_ANDROID,
	ActionBar: NS_TI_ANDROID,

	// Ti.Map
	Annotation: NS_TI_MAP,

	// Ti.Media
	VideoPlayer: NS_TI_MEDIA,
	MusicPlayer: NS_TI_MEDIA,

	// Ti.UI.iOS
	AdView: NS_TI_UI_IOS,
	CoverFlowView: NS_TI_UI_IOS,
	DocumentViewer: NS_TI_UI_IOS,
	NavigationWindow: NS_TI_UI_IOS,
	TabbedBar: NS_TI_UI_IOS,
	Toolbar: NS_TI_UI_IOS,

	// Ti.UI.iPad
	Popover: NS_TI_UI_IPAD,
	SplitWindow: NS_TI_UI_IPAD,

	// Ti.UI.iPhone
	NavigationGroup: isTitanium && Ti.Platform.osname === 'mobileweb' ?
		NS_TI_UI_MOBILEWEB: NS_TI_UI_IPHONE,
	StatusBar: NS_TI_UI_IPHONE,

	// Ti.UI.Windows
	CommandBar: NS_TI_UI_WINDOWS,
	AppBarButton: NS_TI_UI_WINDOWS,
	AppBarToggleButton: NS_TI_UI_WINDOWS,
	AppBarSeparator: NS_TI_UI_WINDOWS,

	// Ti.UI.Window
	LeftNavButton: 'Ti.UI.Window',
	RightNavButton: 'Ti.UI.Window',
	LeftNavButtons: 'Ti.UI.Window',
	RightNavButtons: 'Ti.UI.Window',
	TitleControl: 'Ti.UI.Window',
	WindowToolbar: 'Ti.UI.Window',

	// Ti.UI.iPad.Popover
	ContentView: 'Ti.UI.iPad.Popover',

	// Table and List proxy properties
	FooterView: '_ProxyProperty._Lists',
	HeaderView: '_ProxyProperty._Lists',
	HeaderPullView: '_ProxyProperty._Lists',
	PullView: '_ProxyProperty._Lists',
	Search: '_ProxyProperty._Lists',
	SearchView: '_ProxyProperty._Lists',

	// misc proxy properties
	RightButton: '_ProxyProperty',
	LeftButton: '_ProxyProperty',
	KeyboardToolbar: '_ProxyProperty',
	ActionView: '_ProxyProperty'

};

// properties named with "on" that aren't used to signify event listeners
exports.SPECIAL_PROPERTY_NAMES = [
	'onHomeIconItemSelected',
	'onTintColor',
	'onCreateOptionsMenu',
	'onPrepareOptionsMenu'
];

exports.COMMANDS = {
	GENERATE: 'generate'
};
