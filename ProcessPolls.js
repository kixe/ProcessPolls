/**
 * set cookie via ajax request if conditions of participation are accepted
 *
 */
jQuery(document).ready(function() {

	var tokenLoader = $('button#ajaxTokenLoader');
    tokenLoader.click(function(event) {
    	// alert('success');
    	total = $(this).attr('data-total');
    	offset = $(this).attr('data-offset');
    	limit = $(this).attr('data-limit');
    	url = $(this).attr('data-href');
        $.ajax({
            url: url,
            type: 'post',
            data: {
            	total: total,
            	offset: offset,
                limit: limit
            },
            error: function(xhr){
        		alert('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
    		},
            success: function(data) {
            	data = JSON.parse(data);
            	// alert(data.rows.length);
                if (data.rows.length) {
                	$('#AdminDataTokenTable tbody').append(data.rows);        	             	
                }
                if (data.next < data.total) {
                	// update button 
                	$('button#ajaxTokenLoader').attr('data-offset', data.next);           	
                }
                else {
                	// remove button
                	$('button#ajaxTokenLoader').remove();
                }
            }
        }); 
    });  

	var confirmCheckbox = $('#InputfieldFormPoll #ccop');
	var confirmLabel = $('#InputfieldFormPoll #wrap_ccop label span');
	var formSubmitButton = $('#InputfieldFormPoll button#Inputfield_submit');
	
	var userID = confirmCheckbox.attr('data-user-id');
    var defaultLabel = confirmLabel.html();
    var pollId = confirmCheckbox.attr('value');
    var cookieName = 'poll-' + pollId + '-ccop-'+ userID;
    
    var ts = Date.now() / 1000 | 0;
    var exp = ts - 2592000;

    var confirmedLabel = function(timestamp) {
        var dateObject = new Date(timestamp * 1000);
        var date = dateObject.toLocaleDateString("de-DE");
        var dlc = confirmCheckbox.attr('data-label-confirmed');
        if(typeof dlc === "undefined") return null;
        return dlc.replace("{date}", date);
    }
    
    // console.log(!!$.cookie(cookieName));
    
    // ccop-cookie found or #ccop already checked
    if (!!$.cookie(cookieName) === true || !!$('#ccop').prop('checked') === true) {
		enableButton(formSubmitButton);
        formSubmitButton.removeAttr('title');
        confirmCheckbox.prop('checked', true);
        // confirmCheckbox.attr('value', 1);
        if (!!$.cookie(cookieName) === true) {
        	// cookie expired, remove
        	if ($.cookie(cookieName) < exp) {
				$.ajax({
				url: '/ajaxcookie.php',
				type: 'post',
				data: {
					ajaxCookie: 0,
					cookieName: cookieName
					}
				});
            }
            else {
        		confirmLabel.html(confirmedLabel($.cookie(cookieName)));
        	}
        } 
    }
    
    else {	
		disableButton(formSubmitButton);
 		formSubmitButton.attr('title', formSubmitButton.attr('data-title-disabled'));    
    }

    confirmCheckbox.click(function(event) {
    	pageId = $(this).attr('data-page-id');
    	value = event.target.checked? 1 : 0;
        $.ajax({
            url: '/ajaxcookie.php',
            type: 'post',
            data: {
                ajaxCookie: event.target.checked,
                cookieName: cookieName
            },
            success: function(returnValue) {
                if (returnValue != 0) {
                    enableButton(formSubmitButton);
                    formSubmitButton.removeAttr('title');
                    confirmCheckbox.prop('checked', true);
                    // confirmCheckbox.attr('value', 1);
                    // we expect numeric return value (timestamp), alert if not
                    if (!parseInt(returnValue, 10)) {
                    	alert(returnValue);
                    } else confirmLabel.html(confirmedLabel(returnValue));
                } else {
                	disableButton(formSubmitButton);
                    formSubmitButton.attr('title', formSubmitButton.attr('data-title-disabled'));
                    confirmCheckbox.prop('checked', false);
                    // confirmCheckbox.attr('value', null);
                    confirmLabel.html(defaultLabel);
                }
            }
        })
    });  
});

function disableButton(selector) {
	$(selector).attr('disabled', true);
	$(selector).css({
		'cursor': 'not-allowed',
		'filter': 'alpha(opacity=65)',
		'opacity': '.65'
	});
}

function enableButton(selector) {
	$(selector).attr('disabled', false);
	$(selector).css({
		'cursor': 'pointer',
		'filter': 'alpha(opacity=100)',
		'opacity': '1'
	});
}