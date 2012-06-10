Simple Model
=============

In this example, we're going to build a TableView using the Model capabilities of Alloy.

We define a `todo.json` which defines the schema information for the model.  Since the model can be backed by a multitude of different
types of _adapters_, this helps keep the adapter configuration information separate from the model logic code.  Each _adapter_ will use
the JSON model configuration to perform CRUD operations on the model and provide storage, etc.

We can also provide additional programmatic functionality to our models by implementing certain optional functions such as `validate`.

For Alloy, we will extend each model using `underscore.js` so that we have convenience iteration functions, etc.

Alloy will provide special handling for binding models to certain Titanium views such as a `TableView`.  

In this example, we are going to fetch data for the model (which will fetch all the data from primary storage based on the adapter) and then
create a table view row for each model object.  Alloy will provide a special capability on top of the base TableView to create a template
TableViewRow and bind a model object to the row object.

We subscribe for model change events on each model row and then re-bind any changes back to the row as changed.  This is done with a model `change` event.  We could also use the backbone syntax such as `change:name` to bind a specific model property instead of all changes.



