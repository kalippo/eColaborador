

var principal = Alloy.createController("principal");
principal = principal.getView();

var menu = Alloy.createController("menuLateral");
menu = menu.getView();
	
	
var args = {

	mainView : principal,
	menuView : menu
	
};
	
	
	$.navDrawer.open();
// define your initial view
//$.navDrawer.changeView(principal);


