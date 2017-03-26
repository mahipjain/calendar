$( document ).ready(function() {
	var now = new Date();
	$('.calendar')[0].innerHTML = getCalendar(now.getMonth(), now.getFullYear());
	$('#curr-month-cal')[0].innerHTML = getCalendar(now.getMonth(), now.getFullYear(), 'small');
	$('#curr-month')[0].innerHTML = monthName[now.getMonth()];
	$('#curr-year')[0].innerHTML = now.getFullYear();
	startTime();
	$('#prev-month').click(function(){
		selectedMonth--;
		if(selectedMonth==-1){
			selectedMonth = 11;
			selectedYear--;
		}
		$('.calendar')[0].innerHTML = getCalendar(selectedMonth, selectedYear);
	});
	$('#next-month').click(function(){
		selectedMonth++;
		if(selectedMonth==12){
			selectedMonth = 0;
			selectedYear++;
		}
		$('.calendar')[0].innerHTML = 	getCalendar(selectedMonth, selectedYear);
	});
	$('.date').click(function(event){
		if(!$(event.target).closest('.popup').length && !$(event.target).closest('ul').length){
			$(this).find('.popup-cont').html(popupHtml);
			console.log($(this).attr('id'));
			var d = new Date($(this).attr('id'));
			var long_date = d.getDate() + ' ' + monthName[d.getMonth()] + ' ' + d.getFullYear();
			$(this).find('.popup-date').html(long_date);
			$('#event-submit').attr('onclick', 'validate("'+d+'")');
			$('.popup').show('fast');
		}
	});
	//close popup
	$(document).click(function(event) { 
    if(!$(event.target).closest('.date').length) {
        if($('.popup').is(":visible")) {
            $('.popup').hide('fast');
            $('.popup-cont').html('');
            console.log('jjjjjjj');
	        }
    }        
	});

	get_events_list();
});

function closePopup(e){
	$(e).closest('.popup').hide('fast');
	$(e).closest('.popup-cont').html('');
	console.log(e);
}

function get_events_list(date = ''){
	console.log(date);
	if(date!='') var d = new Date(date);
	else d = new Date();
	var elem_id = d.toLocaleDateString('en-US');
	d = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
	console.log(d);
	$.ajax({
		url: '/events_list/',
		type: 'POST',
		data: {
			date: d,
		},
		success: function(data){
			data = JSON.parse(data);
			console.log(data.length);
			var html = '<ul class="events-list">';
			for(var i =0; i<data.length; i++){
				html += '<li><span class="event-name">\
				'+data[i].name+'</span><span class="event-time">'+data[i].start_time+'</span></li>';
			}
			html+= '</ul>';
			if(date != '') $('[id="'+elem_id+'"]').append(html);
			else $('#todays-events').append(html);
		}
	});
}

function add_event(date){
	var d = new Date(date);
	// console.log(d);
	var x = document.getElementById(d.toLocaleDateString('en-US'));
	var name = $(x).find('#event_name')[0].value;
	var location = $(x).find('#location')[0].value;
	var start_time = $(x).find('#start_time')[0].value;
	var end_time = $(x).find('#end_time')[0].value;
	var description = $(x).find('#description')[0].value;
	d = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
	console.log(d);
	$.ajax({
		url: '/',
		type: 'POST',
		data: {
			date: d,
			name: name,
			location: location,
			start_time: start_time + ':00',
			end_time: end_time + ':00',
			description: description,
		},
		success: function(data){
			console.log(data);
		}
	})
}

function validate(date){
	var d = new Date(date);
	var x = document.getElementById(d.toLocaleDateString('en-US'));
	var name = $(x).find('#event_name')[0].value;
	var location = $(x).find('#location')[0].value;
	var start_time = $(x).find('#start_time')[0].value;
	var end_time = $(x).find('#end_time')[0].value;
	var all_day = $($(x).find('#all_day')[0]).prop('checked');
	var description = $(x).find('#description')[0].value;
	var error = false;
	if(!(name.length > 0)){
		error = true;
		$(x).find('#event_name')[0].insertAfter('Event Name is required.');
	}
	if(start_time=="" && end_time =="" && all_day == false){
		error = true;
		$(x).find('#all_day')[0].insertAfter('Time is required.');		
	}
	if(!error) add_event(date);
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
										<i class="fa fa-times close-btn" aria-hidden="true" onclick="closePopup(this)"></i>\
										<h3 class="popup-date">Wednesday, 15 June 2016</h3>\
										<input type="text" id="event_name" placeholder="Event Name">\
										<input type="text" id="location" placeholder="Location">\
										<label>Starts</label>\
										<input type="date" id="start_date">\
										<input type="time" id="start_time">\
										<label>Ends</label>\
										<input type="date" id="end_date">\
										<input type="time" id="end_time"><br>\
										<input type="checkbox" id="all_day">All Day\
										<label>Description</label>\
										<textarea id="description"></textarea>\
										<input type="button" value="Cancel">\
										<input type="button" value="Save" id="event-submit" class="submit-btn">\
									</form>\
								</div>';

function getCalendar(month, year, type='long') {
	$('#month')[0].innerHTML = monthName[month];
	$('#year')[0].innerHTML = year;
	var d = new Date(year,month,1);
	var day = d.getDay();
	var totalDays = noOfDays(month,year);
	var now = new Date();
	if(type=='long'){
	var html = "<tr class='day-names'>\
			<th>Sunday</th>\
			<th>Monday</th>\
			<th>Tuesday</th>\
			<th>Wednesday</th>\
			<th>Thrusday</th>\
			<th>Friday</th>\
			<th>Saturday</th>\
		</tr>";
	}
	else{
		var html = "<tr class='day-names'>\
			<th>Su</th>\
			<th>Mo</th>\
			<th>Tu</th>\
			<th>We</th>\
			<th>Th</th>\
			<th>Fr</th>\
			<th>Sa</th>\
		</tr>";
	}
	for(var i = 0; i<5; i++){
		html += "<tr>";
		for(var j = i*7; j< (i+1)*7;j++){
			if(j<day){
				var date = new Date(year, month, 1);
				html += "<td>"+relativeDate(date,j-day+1)+"</td>";
			}
			else if(j<=totalDays+2){
				if(type=='long'){
					if(j-day+1 == now.getDate()){
						html += "<td id='"+new Date(year, month, j-day+1).toLocaleDateString('en-US')+"'\
						class='date month-theme today'><div>"+ (j-day+1) +"</div><div class='popup-cont'></div></td>";
					}
					else{
						html += "<td id='"+new Date(year, month, j-day+1).toLocaleDateString('en-US')+"'\
						class='date month-theme'><div>"+ (j-day+1) +"</div><div class='popup-cont'></div></td>";	
					}
				}
				else{
				if(j-day+1 == now.getDate()){
					html += "<td class='month-theme today'>"+ (j-day+1) +"</td>";
					}
				else{
					html += "<td class='month-theme'>"+ (j-day+1) +"</td>";
					}
				}
			}
			else{
				html += "<td>"+ (j-totalDays-2) +"</td>";	
			}
		}
		html +="</tr>";
	}
	return html;
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    m = checkTime(m);
    document.getElementById('clock').innerHTML =
    h + ":" + m;
    var t = setTimeout(startTime, 60000);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
}