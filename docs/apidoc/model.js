/**
 * @class Alloy.Models
 * Class to access or create models.
 *
 * Models can either be created in markup or programmatically in the controller.
 *
 * To create models in markup, see the 'Model Element' section in the
 * [Alloy XML Markup guide](#!/guide/Alloy_XML_Markup).  
 *
 * In the controller code:
 *
 *    * To create a local instance, use the Alloy.createModel method.
 *    * To create a global singleton instance, use the Alloy.Models.instance method.
 *
 * Previously created models through markup or using the `instance` method 
 * are directly accessed as properties of the `Alloy.Models` namespace,
 * using either the name of the model JavaScript file for singletons 
 * or the ID name for local instances.
 */

/**
 * @method instance
 * Creates a singleton instance of a Model based on the given model, or
 * returns an existing instance if one has already been created.
 * @param {String} name the name of the base model for the model
 * @return {Backbone.Model} An Alloy Model object singleton
 */
