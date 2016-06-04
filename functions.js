$(function() {
	$.fn.countdown = function(options, callback) {

		//custom 'this' selector
		thisEl = $(this);

		//array of custom settings
		var settings = { 
			'date': null,
			'format': null
		};

		//append the settings array to options
		if(options) {
			$.extend(settings, options);
		}
		
		//main countdown function
		function countdown_proc() {
			
			eventDate = Date.parse(settings['date']) / 1000;
			currentDate = Math.floor($.now() / 1000);
			
			if(eventDate <= currentDate) {
				callback.call(this);
				clearInterval(interval);
			}
			
			seconds = eventDate - currentDate;
			
			days = Math.floor(seconds / (60 * 60 * 24)); //calculate the number of days
			seconds -= days * 60 * 60 * 24; //update the seconds variable with no. of days removed
			
			hours = Math.floor(seconds / (60 * 60));
			seconds -= hours * 60 * 60; //update the seconds variable with no. of hours removed
			
			minutes = Math.floor(seconds / 60);
			seconds -= minutes * 60; //update the seconds variable with no. of minutes removed
			
			//conditional Ss
			if (days == 1) { thisEl.find(".timeRefDays").text("day"); } else { thisEl.find(".timeRefDays").text("días"); }
			if (hours == 1) { thisEl.find(".timeRefHours").text("hour"); } else { thisEl.find(".timeRefHours").text("horas"); }
			if (minutes == 1) { thisEl.find(".timeRefMinutes").text("minute"); } else { thisEl.find(".timeRefMinutes").text("minutos"); }
			if (seconds == 1) { thisEl.find(".timeRefSeconds").text("second"); } else { thisEl.find(".timeRefSeconds").text("segundos"); }
			
			//logic for the two_digits ON setting
			if(settings['format'] == "on") {
				days = (String(days).length >= 2) ? days : "0" + days;
				hours = (String(hours).length >= 2) ? hours : "0" + hours;
				minutes = (String(minutes).length >= 2) ? minutes : "0" + minutes;
				seconds = (String(seconds).length >= 2) ? seconds : "0" + seconds;
			}
			
			//update the countdown's html values.
			if(!isNaN(eventDate)) {
				thisEl.find(".days").text(days);
				thisEl.find(".hours").text(hours);
				thisEl.find(".minutes").text(minutes);
				thisEl.find(".seconds").text(seconds);
			} else { 
				alert("Invalid date. Here's an example: 12 Tuesday 2012 17:30:00");
				clearInterval(interval); 
			}
		}
		
		//run the function
		countdown_proc();
		
		//loop the function
		interval = setInterval(countdown_proc, 1000);
		
	}

	var showMessage = function(id) {
		var timer_opacity;
		var direction = 1;
		var read_time = 750;
		var reading = false;
		var animation_opacity = function() {
			$(id).css('opacity', parseFloat($(id).css('opacity')) + 0.01 * direction);
			if (reading) {
				read_time--;
				if (read_time <= 0) {
					reading = false;
					direction = -1;
				}
			} else {
				if (parseFloat($(id).css('opacity')) <= 0) {
					clearInterval(timer_opacity);
				} else if (parseFloat($(id).css('opacity')) >= 1) {
					direction = 0;
					reading = true;
				}
			}
		}
		timer_opacity = setInterval(animation_opacity, 5);
	}

	var registered_in_landing = new Firebase("https://mobt.firebaseio.com/registered_in_landing");
	$('#submit').click(function(e) {
		e.preventDefault();
		$('#submit').prop('disabled', true);
		var email = $('#email').val();
		if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
			registered_in_landing.push(email, function(error) {
				if (error) {
					console.error(error);
					showMessage('#register_error');
				} else {
					$('#email').val('');
					showMessage('#email_registered');
				}
				$('#submit').prop('disabled', false);
			});
		} else {
			showMessage('#email_error');
			$('#submit').prop('disabled', false);
		}
	});
});
