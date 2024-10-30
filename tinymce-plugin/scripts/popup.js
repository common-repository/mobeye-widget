//var MOBEYE_WIDGET_URL = "http://mobeye.widget.azure:81/app/";
//var MOBEYE_API_URL = "http://mobeye.api.azure:81/JsonpApi/";
var MOBEYE_WIDGET_URL = "http://widget.mobeye.com/app/";
var MOBEYE_API_URL = "http://api.mobeye.com/JsonpApi/";

$(document).ready(function () {
	if (tinyMCEPopup.getWindowArg('widgetId')){
		loadParameters();
		$('.btn-select-mode-back').remove();
		$("#options").show();
	}
	else {
        var form = $('#new-mobeye-widget').show();
				form.find('#btn-mobeye-widget-new-email-check').click(function(){
					var email = form.find('[name="mobeye-widget-new-email"]').val();
					if (email){
						$.ajax({
							type: 'GET',
							url: MOBEYE_API_URL + "CheckEmail",
							success: function(data){
								console.log(data);
								var block = $('#mobeye-widget-response').empty();
								var answer = $('<span/>').text(data.Text).hide();
								if (data.Response){
									answer.css('color', 'red');
								}
								else{
									answer.css('color', 'green');
								}
								
								block.append(answer);
								block.children().fadeIn(function(){
									var that = $(this);
									setTimeout(function(){
										that.fadeOut();
									}, 5000);
								});
							},
							error: function(){
								var block = $('#mobeye-widget-response')
													.empty()
													.append($('<span/>').text('Connection error').hide().css('color', 'red'));
								
								block.children().fadeIn(function(){
									var that = $(this);
									setTimeout(function(){
										that.fadeOut();
									}, 5000);
								});
							},
							contentType: "application/json",
							dataType: 'jsonp',
							data : {email : email}
						});
					}
					return false;
				});
								
		
		$('.btn-select-mode-back').click(function(){
			$(this).closest('form').fadeOut(function(){
				startBlock.fadeIn();
			});
		});
	}
});

$("#options").on("click", "#save", function (e) {
    var form = document.getElementById("options");
    if (form.checkValidity()) {
        e.preventDefault();
        var widgetIframe = generateIframe();
        if (tinyMCEPopup.execCommand('mceInsertContent', false, widgetIframe)) {
            tinyMCEPopup.close();
        }
    }
});

$("#new-mobeye-widget").on("click", '#btn-mobeye-widget-new-save', function(event){
    var form = document.getElementById("new-mobeye-widget");
    var button = $(this);
	$('#mobeye-widget-create-response').empty();
    if(form.checkValidity()){
        button.attr("disabled", "disabled");
		$('#mobeye-widget-create-response').removeClass("error").addClass("success").text("Waiting ....");
        event.preventDefault();
        $.ajax({
            dataType: "jsonp",
            url: MOBEYE_API_URL + "CreateWidget",
            data: {
                email: $("input[name='mobeye-widget-new-email']").val(),
                youtubeLink: $("input[name='youtube-link']").val(),
                siteUrl: tinyMCEPopup.getWindowArg('siteUrl'),
                cmsVersion: tinyMCEPopup.getWindowArg('cmsVersion'),
				pluginVersion: tinyMCEPopup.getWindowArg('pluginVersion')
            },
            success: function (response){
                if(response.Response){
                    button.removeAttr("disabled");
                    form.style.display = "none";
                    $("#wizard-finish").show();
                    tinyMCEPopup.execCommand('mceInsertContent', false, generateWidgetIframe(response.WidgetId));
                }
				else {
					$('#mobeye-widget-create-response').empty().removeClass("success").addClass("error").text(response.Text);
				}
            },
			error: function(){
				$('#mobeye-widget-create-response').empty().removeClass("success").addClass("error").text("Connection error");
			},
            complete: function (){
                button.removeAttr("disabled");
            }
        });
    }
});

$("#new-mobeye-widget").on("keyup", "input[name='mobeye-widget-new-email']", function (){
    $("#channel-name").val($(this).val().replace(/@.*/, "") + "_widget");
});

function generateIframe() {
    var queryString = [];
    $("#options").find("input[data-parameter-name]").each(function (key, value) {
        var optionControl = $(value);
        var optionValue;
        if (optionControl.attr("type") === "checkbox") {
            optionValue = optionControl.is(":checked");
        } else {
            optionValue = optionControl.val();
        }

        queryString.push(optionControl.data("parameter-name") + "=" + optionValue);
    });
	queryString.push('loginButtonText=' + $('#loginButtonText').val())
    var iframePath = MOBEYE_WIDGET_URL + $("#widget-id").val() + '?' + queryString.join('&');
    var iframe = $("<div/>").append($("<iframe/>")
        .attr("src", iframePath)
        .css({
            "border": 0,
            "overflow": "hidden"
        })
        .attr("width", $("#width").val())
        .attr("height", $("#height").val()));
    return iframe.html();
}

function generateWidgetIframe(widgetId){
    return "<iframe width='960' height='1000' src='" + MOBEYE_WIDGET_URL + widgetId + "' allowtransparency frameborder='0' scrolling='no'></iframe>";
}

function loadParameters() {
    $("#options").find("input[data-parameter-name]").each(function (key, value) {
        var optionControl = $(value);
        var parameterName = optionControl.data("parameter-name");

        if (!tinyMCEPopup.getWindowArg(parameterName)) {
            return;
        }

        if (optionControl.attr("type") === "checkbox") {
            //getWindowArg always returns string
            optionControl.attr("checked", tinyMCEPopup.getWindowArg(parameterName) === "true");
        } else {
            optionControl.val(tinyMCEPopup.getWindowArg(parameterName));
        }
    });

    if (tinyMCEPopup.getWindowArg("widgetId")) {
        $("#widget-id").val(tinyMCEPopup.getWindowArg("widgetId"));
    }

    if (tinyMCEPopup.getWindowArg("width")) {
        $("#width").val(tinyMCEPopup.getWindowArg("width"));
    }

    if (tinyMCEPopup.getWindowArg("height")) {
        $("#height").val(tinyMCEPopup.getWindowArg("height"));
    }
	
	if (tinyMCEPopup.getWindowArg("loginButtonText")) {
        $('#loginButtonText').val(tinyMCEPopup.getWindowArg("loginButtonText"));
    }
}