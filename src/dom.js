class DOM {

    getCategories() {
        const categories = [];
        window._Plugins.widgetData.forEach((field) => {
            // Check if it already exists
            const result = categories.findIndex((item) => field.category.toLowerCase() === item.toLowerCase());
            if (result === -1) categories.push(field.category);
        });
        return categories;
    }

    getStepTemplate(step, stepTemplate) {
        _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
        var interpolator = _.template(stepTemplate);
        return interpolator(step);
    }
      // Add HTML to element
     addHTML(element, html) {
        // Add HTML in the element itself
        element.insertAdjacentHTML('beforeend', html);
        return element;
    }

    // Add HTML to ID.
    addHTMLToID(id, html) {
        const element = document.getElementById(id);
        return this.addHTML(element, html);
    }
    tabActive(){
        document.getElementById(window._Plugins.pluginCategory+'_tab').classList.add("active");
        document.getElementById(window._Plugins.pluginCategory+'_tabpane').classList.add("active");
    }
    cardDetails(app_id){
        window._Plugins.pluginId = app_id;
        const card = window._Plugins.widgetData.find(item=>item.app_id == app_id);
        window._Plugins.pluginCategory = card.category;
        window._Plugins.config_id = card.config_id;
        return card;
    }

    //RefreshDom
    refreshDom(data){
        document.getElementById("tablist").innerHTML="";
        document.getElementById("tab-content").innerHTML="";
        _Plugins.downloadPlugins();
    }

}
export default new DOM();