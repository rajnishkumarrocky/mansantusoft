jQuery(document).ready(function ($) {

	/* auto hide message box */
	var maxTime = 5000; // 5 seconds
	var time = 0;

	var interval = setInterval(function () {
		if ($('#form-message').is(':visible')) {
			setTimeout(function () {
				$("#form-message").fadeOut(500);
			}, 10000);
			clearInterval(interval);
		} else {
			if (time > maxTime) {
				// still hidden, after 2 seconds, stop checking
				clearInterval(interval);
				return;
			}
			// not visible yet, do something
			time += 100;
		}
	}, 2000);

	$("#template-contactform-submit").click(function() {
		sendmail();
	});

});

function sendmail() {
	var name = $('#template-contactform-name').val();
	var email = $('#template-contactform-email').val();
	var phone = $('#template-contactform-phone').val();
	var subject = $('#template-contactform-subject').val();
	var service = $('#template-contactform-service').val();
	var message = $('#template-contactform-message').val();
	var body = "<ul>";
	body += "<li>Name: " + name + "</li>";
	body += "<li>Email: " + email + "</li>";
	body += "<li>Phone: " + phone + "</li>";
	body += "<li>Subject: " + subject + "</li>";
	body += "<li>Service: " + service + "</li>";
	body += "<li>Message: " + message + "</li>";
	body += "</ul>";

	if (name.trim() === "" || email.trim() === "" || subject.trim() === "" || message.trim() === "") {
		return;
	}

	if (!validateEmail(email)) {
		$('#form-message').show();
		$('#form-message .errormsg').html("Your email is invalid.");
		$('#form-message .successmsg').html("");
		return;
	}

	$("#form-submit-button").prop("disabled ", true);
	$('#form-message').hide();

	$.ajax({
		type: "POST",
		url: "http://mxwork-svc.azurewebsites.net/api/sendmail",
		timeout: 8000,
		data: {
			'AccessKey': '2XMQFgIO3UwMhMWp5KCxUe4e9bs3JpKk',
			'FromEmail': email, //'no-reply@mjshomeservices.com',
			'FromName': name,
			'ToEmails': 'info@pongworks.com',
			'Subject': "[PongWorks] New Message From Contact Form!",
			'Content': body
		},
		dataType: "json"
	}).done(function (response) {
		resetForm();
		console.log("custom.contact: " + JSON.stringify(response));
		$('#form-message').show();
		$('#form-message .errormsg').html("");
		$('#form-message .successmsg').html("We have received your Message and will get back to you as soon as possible.");
		$("#form-submit-button").prop("disabled ", false);
		$('.form-process').hide();
	}).fail(function (jqXHR, textStatus, errorThrown) {
		$('#form-message').show();
		$('#form-message .errormsg').html("Cannot send your message, please try again!");
		$('#form-message .successmsg').html("");
		$("#form-submit-button").prop("disabled ", false);
		$('.form-process').hide();
	});
}

function resetForm() {
	$('#template-contactform-name').val('');
	$('#template-contactform-email').val('');
	$('#template-contactform-phone').val('');
	$('#template-contactform-subject').val('');
	$('#template-contactform-message').val('');
	$('#template-contactform-service').val('');
}

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
