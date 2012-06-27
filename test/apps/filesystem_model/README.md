Filesystem Model
================

The sample show how to use the full CRUD features of Backbone as it is integrated into Alloy. In this sample a local file system is utilized and a simple model of books by authors is show.


The JSON model descriptor file show below is used to hook the model to the persistant store adapter. The name of file becomes a model and collection class available to create objects from within the code.

books.json
{
    "defaults": { 
    },
    "adapter": {
        "type": "filesystem",
        "filename": "books"
    }
}


ToDo
====

The file system adapter while writing to the local filesytem is not implemented fully. Currently the collection of models are written to file named in the JSON model description. A better solution would be to create a local file for each model with the file name concatenated with the model id. This would make sync'ing more natural and matched to the Backend server. 