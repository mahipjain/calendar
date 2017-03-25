$( document ).ready(function() {
	var now = new Date();
	getCalendar(now.getMonth(), now.getFullYear());
	$('#prev-month').click(function(){
		selectedMonth--;
		if(selectedMonth==-1){
			selectedMonth = 11;
			selectedYear--;
		}
		getCalendar(selectedMonth, selectedYear);
	});
	$('#next-month').click(function(){
		selectedMonth++;
		if(selectedMonth==12){
			selectedMonth = 0;
			selectedYear++;
		}
		getCalendar(selectedMonth, selectedYear);
	});
	$('.date').click(function(event){
		if(!$(event.target).closest('.popup').length){
			$(this).find('.popup-cont').html(popupHtml);
			console.log($(this).attr('id'));
			var d = new Date($(this).attr('id'));
			$(this).find('.popup-date').html(d);
			$('#event-submit').attr('onclick', 'add_event("'+d+'")');
			$('.popup').show('fast');
		}
	})

	$(document).click(function(event) { 
    if(!$(event.target).closest('.date').length && !$(event.target).closest('.popup').length) {
        if($('.popup').is(":visible")) {
            $('.popup').hide('fast');
            $('.popup-cont').html('');
            console.log('jjjjjjj');
	        }
    }        
	})
	// $('#event-submit').click(function(event){
	// 	console.log("jjhj");
	// 	var d = $(this).closest('.popup-date').attr('id');
	// 	console.log(d);
	// });
});

function add_event(date){
	var d = new Date(date);
	// console.log(d);
	var x = document.getElementById(d.toLocaleDateString('en-US'));
	var name = $(x).find('#event_name')[0].value;
	var location = $(x).find('#location')[0].value;
	var start_time = $(x).find('#start_time')[0].value;
	var end_time = $(x).find('#end_time')[0].value;
	var description = $(x).find('#description')[0].value;
	d = d.getFullYear() + '-' + d.getMonth() + '-' + (d.getDate()+1);
	console.log(d);
	$.ajax({
		url: '/',
		type: 'POST',
		data: {
			date: d,
			name: name,
			location: location,
			start_time: start_time,
			end_time: end_time,
			description: description,
		},
		success: function(data){
			console.log(data);
		}
	})
}

function noOfDays(month, year) {
	return new Date(year, month+1, 0).getDate();
}

function relativeDate(date, delta) {
	date.setDate(delta);
	return date.getDate();
}
var now = new Date();
var selectedMonth = now.getMonth();
var selectedYear = now.getFullYear();

var monthName = new Array();
monthName[0] = "January";
monthName[1] = "February";
monthName[2] = "March";
monthName[3] = "April";
monthName[4] = "May";
monthName[5] = "June";
monthName[6] = "July";
monthName[7] = "August";
monthName[8] = "September";
monthName[9] = "October";
monthName[10] = "November";
monthName[11] = "December";

var popupHtml = '<div class="popup">\
									<form>\
										<h3 class="popup-date">Wednesday, 15 June 2016</h3>\
										<input type="text" id="event_name" placeholder="Event Name">\
										<input type="text" id="location" placeholder="Location">\
										<label>Starts</label>\
										<input type="time" id="start_time">\
										<label>Ends</label>\
										<input type="time" id="end_time">\
										<input type="checkbox" id="all_day">\
										<label>Description</label>\
										<textarea id="description"></textarea>\
										<input type="button" value="Cancel">\
										<input type="button" value="Save" id="event-submit">\
									</form>\
								</div>';

function getCalendar(month, year) {
	$('#month')[0].innerHTML = monthName[month];
	$('#year')[0].innerHTML = year;
	var d = new Date(year,month,1);
	var day = d.getDay();
	var totalDays = noOfDays(month,year);
	var html = "<tr>\
			<th>Sunday</th>\
			<th>Monday</th>\
			<th>Tuesday</th>\
			<th>Wednesday</th>\
			<th>Thrusday</th>\
			<th>Friday</th>\
			<th>Saturday</th>\
		</tr>";
	for(var i = 0; i<5; i++){
		html += "<tr>";
		for(var j = i*7; j< (i+1)*7;j++){
			if(j<day){
				var date = new Date(year, month, 1);
				html += "<td>"+relativeDate(date,j-day+1)+"</td>";
			}
			else if(j<=totalDays+2){
				html += "<td id='"+new Date(year, month, j-day+1).toLocaleDateString('en-US')+"' class='date'>"+ (j-day+1) +"<div class='popup-cont'></div></td>";
			}
			else{
				html += "<td>"+ (j-totalDays-2) +"</td>";	
			}
		}
		html +="</tr>";
	}
	$('.calendar')[0].innerHTML = html;
}