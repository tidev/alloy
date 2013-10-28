$.testwin.addEventListener("click",function(){
    Alloy.Globals.detail_navGroup.open(Alloy.createController('detailWin').getView(), {animated: true});
});