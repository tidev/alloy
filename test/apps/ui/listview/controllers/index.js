function myOnDisplayItem(e) {}
 
var myTemplate = {
  properties: {
    onDisplayItem: myOnDisplayItem,
    selectedBackgroundColor: 'blue',
    height: 120,
  },
  childTemplates: [
  {
    type: 'Ti.UI.Label',
    id:'cellLabel',
    properties: {
      color: '#576996',
      font: { fontFamily:'Arial', fontSize: 13, fontWeight:'bold'},
      left: 10, top: 6,
      width: 200, height: 30,
      text: 'Label'
    }
  },
  {
    type: 'Ti.UI.ImageView',
    id: 'cellImage',
    properties: {
      image: '/images/tony.jpg',
      left: 70, top: 6,
      width: 200, height: 100,
    }
  }]
};
 
var section = Ti.UI.createListSection({
  headerTitle: 'Section Title'
});
 
$.list.templates = { myCell: myTemplate };
$.list.sections = [section];
$.index.open();
   
section.setItems([
  {
    template: 'myCell',
    properties: { accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK }
  },
  { template: 'myCell' },
  { template: 'myCell' },
  {
    template: Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE,
    properties: {
      title: 'Cell Title',
      subtitle: 'Cell Subtitle',
      image: '/images/appc.png'
    }
  }
]);