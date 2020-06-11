import DOM from './dom.js';
import _ from 'lodash';
const _500Client = require('@500apps/500apps-web');
/**
 * @class Widgets - Which will show plugins and plugin details in the UI
 */
export default class Widgets {
 
     /**
     * To show  plugins that are installed by the user from maketplace
     * @param {Array} pluginsData - Installed plugins array
     */
    showPlugins(pluginsData){
        console.log("in");
        document.getElementById('_500plugins_loader').style.display = "none";
        window._Plugins.widgetData = pluginsData;
       // return window._Plugins.widget.showappsData();
        
        const categories = DOM.getCategories();
        console.log("debugg here");
        // Add Category to the topsection
        categories.forEach((category) => window._Plugins.widget.addCategory(category));
        window._Plugins.pluginCategory = window._Plugins.pluginCategory == ""?categories[0]:window._Plugins.pluginCategory;
        DOM.tabActive();
    }
    /**
     * Bind ui under category
     * @param name - Category name
     */
    addCategory(name) {
        console.log("in");
        const html = DOM.getStepTemplate({ name: name, menu: name+"_tabpane" }, require('./html/category.html'));
        console.log(html);
        DOM.addHTMLToID('tablist', html);
        // Get cards for this category
        const categorydata = window._Plugins.widgetData.filter(item=>item.category == name);
        // Add cards to the category
        const cardHtml = DOM.getStepTemplate({ data: categorydata, category: name }, require('./html/card.html'));
        DOM.addHTMLToID('tab-content', cardHtml);
      }

   
    /**
    * Open Oauth child window to get authorization from user
    * @param {Object} widgetData
    */
    pluginAuthorization(widgetData) {

        //window.open(url,'popUpWindow','height=300,width=700,left=50,top=50,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
        var win_url = window.open(`${window._Plugins.serverUrl}/Oauth?pluginId=${widgetData.pluginId}&apiKey=${_500Client.api.getApiKey()}&name=${widgetData.pluginName}&token=${_Plugins.userKey}`, 'popUpWindow', 'height=500,width=700,left=50,top=50,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
        let interval = setInterval(function(){ if(win_url.closed){ DOM.refreshDom(); clearInterval(interval)} }, 2000);
    }

     /**
     * To show plugin authorization fields 
     * @param {Object} pluginFields - plugin authorization fields
     * @type check whether update or save 
     */

    showForm(pluginFields,type){
        // Store plugin authorization fields 
        const fields = pluginFields ? JSON.parse(pluginFields[0].app_fields).fields : [];
        console.log(fields);
        const card = DOM.cardDetails(window._Plugins.pluginId);
        const formHtml = DOM.getStepTemplate({ data: fields, card :card, type:type}, require('./html/fields.html'));
        DOM.addHTMLToID(card.category+"_form", formHtml);
        document.getElementById(card.category+"_home").style.display = "none";
        console.log(formHtml)
    }
    // Cancel if from is not submit
    formCancel(){
        const card = DOM.cardDetails(window._Plugins.pluginId);
        document.getElementById(card.category+"_home").style.display = "flex";
        document.getElementById(card.category+"_form").innerHTML ="";
    }
    
    /**
     * To show plugin authorization fields
     * @type check whether update or save 
     */
    formSubmit(type){
       let formJson =  this.isvalidate();
       if(formJson != ""){
         console.log(formJson);
         // Rest call information
            let options = {
                "method": 'POST',
                "headers": {
                    'Content-Type': 'application/json',
                    token : _Plugins.userKey
                },
                "body": JSON.stringify({fields:formJson})
            }
            // Rest call URL
            let url = `basic/auth/${window._Plugins.pluginId}`;
            // Call 500apps utility data method to add plugin to user
            return _500Client.rest.data(url, options, DOM.refreshDom, window._Plugins.restFailure)
        }
    }
    /**
     * check whether validations supports
     */
    isvalidate(){
        // Get plugin fields form by formId 
        let form = document.getElementById(window._Plugins.pluginId+"_form");
        // To store fields values
        let fields = {};
        let count = 0;
        for (let i = 0; i < form.length; i++) {
            let errorId = form.elements[i].name+"_error";
            if(form.elements[i].required && form.elements[i].value == ""){
                document.getElementById(errorId).style.display ="block";
                count++;
            }else{
                document.getElementById(errorId).style.display ="none";
                fields[form.elements[i].name] = form.elements[i].value;
            }
        }
        fields = JSON.stringify(fields);
        // Rest call information
        if(count > 0){return ""}else{ return fields};
    }
    

    /**
     * To show plugin cards 
     * @param {Array} pluginCards - plugin cards array
     */
    showPluginCards(pluginCards) {

        // Store html for plugin cards
        let innerHtml = Templates.pluginCardsTemplate(pluginCards);

        // Call renderHtml method to append html to selector
        return window._Plugins.widget.renderHtml(innerHtml, pluginCards, '_500plugins_widget')
    }

    /**
     * To show plugin card data
     * @param {Array} resObj - Plugins card data
     */
    showPluginCardDetails(resObj) {
        
        // Store html table for plugins card data
        let innerHtml = Templates.cardDetailsTemplate(resObj);

        // Call renderHtml method to append html to selector
        return window._Plugins.widget.renderHtml(innerHtml, resObj, 'view_div')
    }
}