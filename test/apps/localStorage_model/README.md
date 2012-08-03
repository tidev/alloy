localStorage Model
==================

This sample shows how to use the features of Alloy's built-in Backbone support when running on the Mobile Web platform. For Mobile Web a HTML5 localStorage adpater will persist the Backbone model.


The JSON model descriptor below is used to create the localStorage and store the model. The file name book is the name of the model and the adapter name is the name that the key/value is stored under.

book.json
{
    "adapter": {
        "type": "localStorage",
        "name": "books"
    }
}

Supported Platforms
===================

Mobile Web 

