/**
 * By using Drawer as our main controller we allow the option to insert a login
 * screen in between the start of the app and opening the "main" page.
 * Recommendation: if  you do add login, create a login controller, and decide
 * in this controller if you want to open login or Drawer. 
 */
Alloy.createController('Drawer').getView().open();
