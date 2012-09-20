SQL Model
=============

In this example, we're going to build a TableView using the Model capabilities of Alloy.

We define a Javascript model descriptor file in <project>/app/models which defines the schema information for the model.  
A key item in the descriptor file is the adapter object. It contains the adapter type and the name of the persistent store. When the adapter is 'sql' then the name is the table name where the model will be stored. 
Since the model can be backed by a multitude of different. The adapter provides a CRUD interface from the model date to the persistent store.

We subscribe for collection fetch events.  We could also use the backbone syntax such as `change:name` to bind a specific model to get finer event handling.


Migrations
----------

Alloy supports DB migrations much like Rails.  The Alloy command line (and Studio) will support the creation of models and 
migration files.   The migration will allow the programmer to control the low-level migration of the data base model.

