(function () {

    // Create a new plugin class
    tinymce.create('tinymce.plugins.MobEyeWidget', {
        init: function (editor, url) {
            // Register an example button
            editor.addButton('mobeyewidget', {
                title: 'Insert MobEye Widget',
                onclick: function () {
                    // Open window
                    var selection = editor.selection.getContent();
                    var parameters = parseParameters(selection);
                    parameters.siteUrl = mobeye.siteUrl;
                    parameters.cmsVersion = mobeye.cmsVersion;
                    parameters.pluginVersion = mobeye.pluginVersion;

                    editor.windowManager.open({
                        url: url + '/popup.html',
                        width: 320,
                        height: 300,
                        inline: true,
                        resizable: true
                    }, parameters);
                },
                image: url + "/images/icon.png",
                'class': 'bold' // Use the bold icon from the theme
            });
        }
    });

    /**
     * Parse parameters of mobeye iframe element
     * @param {string} Iframe of MobEye widget
     * @returns {{Object}} Widget parameters
     */
    function parseParameters(iframeTag) {
        var testWidgetRegex = /^<iframe.*?src="https?:\/\/(?:www\.)?widget\.mobeye\.(com|co\.il)/i;
        var parameters = {};

        if (testWidgetRegex.test(iframeTag)) {
            var parametersRegex = /[?;&]([\w\d]+)=([\w\d]+)["&]/g;
            var parsedParameters;
            while ((parsedParameters = parametersRegex.exec(iframeTag)) !== null) {
                parameters[parsedParameters[1]] = parsedParameters[2];
            }

            var groupRegexResult = /\/app\/(\d+)/.exec(iframeTag);
            if (groupRegexResult && groupRegexResult[1]){
                parameters.widgetId = groupRegexResult[1];
            }
        }

        var heightMatches = /height="(\d+)"/i.exec(iframeTag);
        if (heightMatches) {
            parameters["height"] = heightMatches[1];
        }

        var widthMatches = /width="(\d+)"/i.exec(iframeTag);
        if (widthMatches) {
            parameters["width"] = widthMatches[1];
        }

        return parameters;
    }

    // Register plugin with a short name
    tinymce.PluginManager.add('mobeyewidget', tinymce.plugins.MobEyeWidget);
})();