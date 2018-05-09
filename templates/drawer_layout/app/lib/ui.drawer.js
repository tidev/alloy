var drawerWindow = function(args) {
  this.args = args;
  this.navView = null;
  this.win = Ti.UI.createWindow(args);

  if (!this.args.leftWidth) {
    this.args.leftWidth = 300;
  }
  if (!this.args.animationDuration) {
    this.args.animationDuration = 500;
  }

  var context = this;
  var buttonImg = Ti.UI.createImageView({
    image : '/images/menu.png'
  });

  buttonImg.addEventListener('click', function() {
    context.menuClickCb && context.menuClickCb();
  });

  this.win.leftNavButton = buttonImg;
};

drawerWindow.prototype.toggleLeft = function() {
  this.showDrawer();
};

drawerWindow.prototype.add = function(view) {
  if (view.role === 'centerView') {
    this.win.add(Alloy.createController(view.src, view).getView());
  }
  if (view.role === 'leftView') {
    this.navView = view;
    this.navView.width = this.args.leftWidth;
  }
};

drawerWindow.prototype.open = function(opts) {
  this.win.open(opts);
};

drawerWindow.prototype.getView = function() {
  return this.win;
};

drawerWindow.prototype.addEventListener = function(event, cb) {
  this.menuClickCb = cb;
};

drawerWindow.prototype.showDrawer = function() {
  var navWin = Alloy.createController(this.navView.src, this.navView).getView();

  var args = {
    navigation : navWin
  };
  args.drawerWidth = this.args.leftWidth;
  args.animationDuration = this.args.animationDuration;

  Alloy.createController('menu', args).open();
};

exports.createWindow = function(args) {
  return new drawerWindow(args);
};

exports.createNavigationWindow = function(args) {
  var opts = _.clone(args);
  delete opts.window;
  if (args.window.getView) {
    opts.window = args.window.getView();
  }
  args = null;
  return Ti.UI.iOS.createNavigationWindow(opts);
};

exports.createView = function(args) {
  return args;
};

