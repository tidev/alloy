localStorage Model
==================

The sample show how to use the full CRUD features of Backbone when runing on Mobile Web. 


The JSON model descriptor file show below is used to hook the model to the persistant store adapter. The name of file becomes a model and collection class available to create objects from within the code.

books.json
{
    "defaults": { 
    },
    "adapter": {
        "type": "localStorage",
        "filename": "books"
    }
}

Supported Platforms
===================

Mobile Web 

ToDo
====

Handle multiple persistent stores. Delete is not completly clearing all models.