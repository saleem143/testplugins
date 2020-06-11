import Widget from './widget.js';
import DOM from './dom.js';
const _500Client = require('@500apps/500apps-web');

/**
 * @class Plugins - Which will download plugins and plugin details
 */
class Plugins {

    /**
     * Constructor 
     */
    constructor() { 
        this.userId = 2600;        // Store user id
        this.widgetCardDetails = {}; // Store plugin cards datails
        this.widgetData = {};   // Store plugins configuration data from apikey
        this.installedPlugins = [];// Store installed plugins
        this.configurePlugins = [];// Store market place plugins
        this.serverUrl = 'https://plugin.500apps.com/pv1'; // Store server url,
        this.dbUrl = 'https://plugins.us1.500apps.io/v2'; // Store db url
        this.userKey = '';// Store user key to identify user
        this.userJSON = {}; // Store user JSON
        this.pluginCategory =""; //default plugins catgory empty
    }

    /**
     * Initialization method (starting point)
     * @param {String} apiKey - Developer api key
     * @param {Object} userJSON - App login user details including name and email 
     */
    init(apiKey, userJSON) {
        console.log("in init plugins");
         
        // Call 500apps utility setApiKey method to set api key
        _500Client.api.setApiKey(apiKey);
        
        // Call 500apps utility setServerURL method to set server url
        _500Client.rest.setServerURL(this.serverUrl);

        //loader showing while making rest call
        document.getElementById('_500plugins_loader').style.display = "block";

         userJSON = JSON.stringify(userJSON);
        // Call 500apps utility data method to get userkey 
        return _500Client.rest.data(`getUserKey/${apiKey}?user_obj=${userJSON}`, {}, this.identifyUser, this.restFailure)
    }

    /**
     * Sets user key to identify at our side 
     * @param {String} key - User key
     */
    identifyUser(key) {
        // Store user key 
        _Plugins.userKey = key;

        // Get API key
        _Plugins.apiKey = _500Client.api.getApiKey();

        // Call downloadPlugins method to get all plugins
        _Plugins.downloadPlugins();
    }

    /**
     * Sets user json 
     * @param {Object} userJSON 
     */
    setUserJSON(userJSON) {
        // Store user JSON like name and email
        this.userJSON = userJSON;
    }

    /**
     * To download plugins that are configured by the developer in plugins.ly
     * @param {String} apiKey
     */
    downloadPlugins() {
        // Rest call URL
        let url = `getActiveApps/${ _Plugins.apiKey}`; 

        //loader showing while making rest call
        document.getElementById('_500plugins_loader').style.display = "block";

        // Call 500apps utility data method to get developer configured plugins
        return _500Client.rest.data(url, {
            headers: {
                'Content-Type': 'application/json',
                'token' : _Plugins.userKey
              }
        }, window._Plugins.widget.showPlugins, this.restFailure)
    }

     /**
     * To check plugin has been configured by user or not and call respective callbacks
     * @param {Number} app_id -app id
     */
    isPluginConfigured(app_id){
        const card = DOM.cardDetails(app_id);
        if (card.auth_type !== "Oauth") { 
            // Rest call URL
            let url = `app_fields/${app_id}`;
            // Return 500apps utility data method to get plugin fields
            return _500Client.rest.data(url, {}, (data) => window._Plugins.widget.showForm(data,"Add"), this.restFailure);
        }
         // Create object for user authorization
        let widgetData = {
            "pluginId": app_id,
            "pluginName": card.name,
            "apiKey": "_Plugins.apiKey"
        }
        return window._Plugins.widget.pluginAuthorization(widgetData);
    }
    
    /**
     * Get plugin cards from server
     * @param {Number} pluginId
     */
    initPlugin(pluginId) {
        // Rest call URL to get plugin cards
        let url = `get_cards/${pluginId}`;
        // Call 500apps utility data method to get plugin cards 
        return _500Client.rest.data(url, {}, window._Plugins.widget.showPluginCards, this.restFailure)
    }

    /**
     * Get plugin card details from server 
     * @param {Number} pluginCardId
     * @param {Number} pluginId
     */
    getPluginCardDetails(pluginCardId, pluginId) {

        // Rest call URL
        let url = `get_data/${pluginCardId}/${window._Plugins.userId}/${pluginId}`;

        // Call 500apps utility data method to get plugin card details 
        return _500Client.rest.data(url, {}, this.filterPluginCardDetails, this.restFailure)
    }

     /**
     * Delete plugins configurations from DB
     * @param {Number} id app_id
     */
    deletePlugin(id){
        const card = DOM.cardDetails(id);
        return _500Client.rest.data(`disable/auth/${id}`, {
            "method": 'DELETE',
            "headers": {
                'Content-Type': 'application/json',
                token: _Plugins.userKey
            }
        }, DOM.refreshDom, this.restFailure);
    }
   
    /**
     * Edit plugins configurations detains 
     * @param {Number} id app_id
     */
    formEdit(app_id){
        const card = DOM.cardDetails(app_id);
        window._Plugins.pluginId = app_id;
        return _500Client.rest.data(`auth/fields/${app_id}`, {
            "headers": {
                'Content-Type': 'application/json',
                token: _Plugins.userKey
            }
        }, (data) => {
            var app_fields = JSON.parse(data[0].app_fields);
            var user_key = JSON.parse(data[0].user_key)
            app_fields.fields.map((item, index) => {
                item["value"] = user_key[item.name]
            });
            window._Plugins.widget.showForm([{ "app_fields": JSON.stringify(app_fields)}],"Update");
        }, this.restFailure)

    }

    /**
     * Rest call failure
     * @param {*} response 
     */
    restFailure(response) {
         //loader showing while making rest call
         document.getElementById('_500plugins_loader').style.display = "none";
         alert('Rest call failed', response);
        console.log('Rest call failed', response);
    }

}
(() => {
    window._Plugins = new Plugins();
    // Create instance for Widget class
    window._Plugins.widget = new Widget();

})();