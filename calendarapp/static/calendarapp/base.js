//Global Variables
var now = new Date();
var selectedMonth = now.getMonth();
var selectedYear = now.getFullYear();
var monthName = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
var dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
"Friday", "Saturday"];
var popupHtml = '<div class="popup">\
									<form>\
										<i class="fa fa-times close-btn" aria-hidden="true" onclick="closePopup(this)"></i>\
										<h3 class="popup-header">Wednesday, 15 June 2016</h3>\
										<input type="text" id="event_name" placeholder="Event Name">\
										<input type="text" id="location" placeholder="Location">\
										<label>Starts</label>\
										<input type="date" id="start_date">\
										<input type="time" id="start_time">\
										<label>Ends</label>\
										<input type="date" id="end_date">\
										<input type="time" id="end_time"><br>\
										<input type="checkbox" id="all_day" onclick="toggleTimeFields(this)">All Day\
										<label>Description</label>\
										<textarea id="description"></textarea>\
										<input type="button" value="Cancel" onclick="closePopup(this)">\
										<input type="button" value="Save" id="event-submit" class="submit-btn">\
									</form>\
								</div>';

$( document ).ready(function() {
	$('.calendar')[0].innerHTML = getCalendar(now.getMonth(), now.getFullYear());
	$('#curr-month-cal')[0].innerHTML = getCalendar(now.getMonth(), now.getFullYear(), 'small');
	$('#curr-month')[0].innerHTML = monthName[now.getMonth()];
	$('#curr-year')[0].innerHTML = now.getFullYear();
	startTime();
	prevMonth();
	nextMonth();
	show_popup();
	close_popup();
	get_events_list();
});

//load previous month calendar
function prevMonth(){
	$('.prev-month').click(function(){
		selectedMonth--;
		if(selectedMonth==-1){
			selectedMonth = 11;
			selectedYear--;
		}
		$('.calendar')[0].innerHTML = getCalendar(selectedMonth, selectedYear);
		refresh();
	});
}

//load previous month calendar
function nextMonth(){
	$('.next-month').click(function(){
		selectedMonth++;
		if(selectedMonth==12){
			selectedMonth = 0;
			selectedYear++;
		}
		$('.calendar')[0].innerHTML = 	getCalendar(selectedMonth, selectedYear);
		refresh();
	});
}

//get event details from backend and displays it
function eventDetails(id,event){
	$('.popup').hide('fast');
	$('.popup-cont').html('');
	$.ajax({
		url:'/event/'+id+'/',
		success: function(data){
			data = JSON.parse(data);
			var eventPopup = '<div class="popup">\
													<i class="fa fa-times close-btn" aria-hidden="true" onclick="closePopup(this)"></i>\
													<div>\
														<h3 class="popup-header">'+data.name+'</h3>';
							if(data.location != ''){
							eventPopup += '<h4>Where</h4>\
														<p>'+data.location+'</p>';
							}
							eventPopup +=	 '<h4>When</h4>\
														<p>'+data.start_datetime+' - '+data.end_datetime+'</p>';
														
							if(data.description != ''){
							eventPopup += '<h4>Description</h4>\
														<p>'+data.description+'</p>';
							}
							eventPopup += '</div>\
													<input type="button" value="Delete" onclick="delete_event('+data.id+')">\
													<input type="button" class="submit-btn" value="Edit" onclick="edit_event('+data.id+')">\
												</div>';
			$('#event'+id).parent().parent().parent().find('.popup-cont').html(eventPopup);
			var clickX = $('#event'+id).offset().left;
			var clickY = $('#event'+id).offset().top;
			positionPopup(clickX, clickY);
			$('.popup').show('fast');
		}
	});
}

//to show popup on click on any '.date' element
function show_popup(){
	$('.date').click(function(event){
		if(!$(event.target).closest('.popup').length && !$(event.target).closest('ul').length){
			$('.popup').hide('fast');
  		$('.popup-cont').html('');
			$(this).find('.popup-cont').html(popupHtml);
			var d = new Date($(this).attr('id'));
			var long_date = dayName[d.getDay()]+', '+ d.getDate() + ' ' + monthName[d.getMonth()] + ' ' + d.getFullYear();
			$(this).find('.popup-header').html(long_date);
			var input_date = inputDate(d);
			$(this).find('#start_date').val(input_date);
			$(this).find('#end_date').val(input_date);
			$('#event-submit').attr('onclick', 'validate("'+d+'")');
			var clickY = event.pageY;
			var clickX = event.pageX;
			positionPopup(clickX, clickY);
			$('.popup').show('fast');
		}
	});
}

//position popup if trys to go out of viewport
function positionPopup(clickX, clickY){
	var viewportH = $(window).height();
	var viewportW = $(window).width();
	if(clickY > viewportH - 400){
		$('.popup').css('margin-top', (viewportH-clickY-420)+'px');
	}
	if(clickX > viewportW - 300){
		$('.popup').css('margin-left', (viewportW-clickX-300)+'px');
	}
}

//closes popup on document click
function close_popup(){
	$(document).click(function(event) { 
    if(!$(event.target).closest('.date').length) {
        if($('.popup').is(":visible")) {
            $('.popup').hide('fast');
            $('.popup-cont').html('');
	        }
    }        
	});
}

//deletes event
function delete_event(event_id){
	$.ajax({
		url: '/delete/'+event_id+'/',
		success: function(){
			$('.popup').hide('fast');
      $('.popup-cont').html('');
      refresh();
		}
	})
}

//shows popup to edit an event
function edit_event(event_id){
	$.ajax({
		url:'/event/'+event_id+'/',
		success: function(data){
			data = JSON.parse(data);
			$('.popup').hide('fast');
      $('.popup-cont').html('');
      var d = $('#event'+event_id).closest('.date').attr('id');
      d = new Date(d);
      $('#event'+event_id).parent().parent().parent().find('.popup-cont').html(popupHtml);
      $('#event_name').val(data.name);
      $('#location').val(data.location);
      $('#start_date').val(data.start_date);
      var temp = data.start_time.split(':');
      var start_time = temp[0] + ':' + temp[1];
      temp = data.end_time.split(':');
      var end_time = temp[0] + ':' + temp[1];
      $('#start_time').val(start_time);
      $('#end_date').val(data.end_date);
      $('#end_time').val(end_time);
      $('#description').val(data.description);
      $('#event-submit').attr('onclick','validate("'+d+'",'+data.id+')');
      var clickX = $('#event'+event_id).offset().left;
			var clickY = $('#event'+event_id).offset().top;
			positionPopup(clickX, clickY);
			$('.popup').show('fast');
		}
	})
}

//refresh events
function refresh(){
	get_events_list();
	for(var x = 0; x < $('.date').length; x++){
		$elem = $('.date')[x];
		var d = $($elem).attr('id');
		get_events_list(d);
	}
	show_popup();
}

//disable/enable according to if "all day" is selected or not
function toggleTimeFields(e){
	var all_day = $(e).prop('checked');
	if(all_day){
		$('#all_day').parent().find('#start_time, #start_date, #end_time, #end_date').prop('disabled', true);
	}
	else{
		$('#all_day').parent().find('#start_time, #start_date, #end_time, #end_date').prop('disabled', false);
	}
}


//close popup on clicking 'x' button
function closePopup(e){
	$(e).closest('.popup').hide('fast');
	$(e).closest('.popup-cont').html('');
}

//gets and displays events on calendar
function get_events_list(date = ''){
	if(date!='') var d = new Date(date);
	else d = new Date();
	var elem_id = d.toLocaleDateString('en-US');
	d = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
	$.ajax({
		url: '/events_list/',
		type: 'POST',
		data: {
			date: d,
		},
		success: function(data){
			data = JSON.parse(data);
			var html = '<ul class="events-list">';
			for(var i =0; i<data.length; i++){
				if(date !=''){
				html += '<li id="event'+data[i].id+'" onclick="eventDetails('+data[i].id+')"><span class="event-name">\
				'+data[i].name+'</span><span class="event-time">'+data[i].start_time+'</span></li>';
				}
				else{
					html += '<li><span class="event-name">\
				'+data[i].name+'</span><span class="event-time">'+data[i].start_time+'</span></li>';
				}
			}
			html+= '</ul>';
			if(date != '') $('[id="'+elem_id+'"]').find('.events-list').html(html);
			else $('#todays-events').html(html);
		}
	});
}

//validate data before adding/editing event
function validate(date, event_id=null){
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
		$('<p class="error">Event Name is required.</p>').insertAfter($(x).find('#event_name')[0]);
	}
	if(start_time=="" && end_time =="" && all_day == false){
		error = true;
		$('<p class="error">Time is required.</p>').insertAfter($(x).find('#all_day')[0]);
	}
	if(!error) add_event(date,event_id);
}

//used to save new/edited event if its valid
function add_event(date, event_id=null){
	var d = new Date(date);
	var x = document.getElementById(d.toLocaleDateString('en-US'));
	var name = $(x).find('#event_name')[0].value;
	var location = $(x).find('#location')[0].value;
	var start_date = new Date($(x).find('#start_date')[0].value);
	start_date = inputDate(start_date);
	var start_time = $(x).find('#start_time')[0].value;
	var end_date = new Date($(x).find('#end_date')[0].value);
	end_date = inputDate(end_date);
	var end_time = $(x).find('#end_time')[0].value;
	var description = $(x).find('#description')[0].value;
	d = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
	var all_day = $($(x).find('#all_day')[0]).prop('checked');
	if(event_id) {
		var url= '/update_event/'+event_id+'/';
	}
	else {
		var url = '/';
	}
	$.ajax({
		url: url,
		type: 'POST',
		data: {
			date: d,
			name: name,
			location: location,
			start_date: start_date,
			start_time: start_time + ':00',
			end_date: end_date,
			end_time: end_time + ':00',
			description: description,
			all_day: all_day,
		},
		success: function(data){
			$('.popup').hide('fast');
			$('.popup-cont').html('');
			refresh();
		}
	})
}

function noOfDays(month, year) {
	return new Date(year, month+1, 0).getDate();
}

//returns dates of previous month
function relativeDate(date, delta) {
	date.setDate(delta);
	return date.getDate();
}

//loads calendar of a particular month/
//'long' type for main calendar, else (or 'short') for calendar in left container
function getCalendar(month, year, type='long') {
	$('#month')[0].innerHTML = monthName[month];
	$('#year')[0].innerHTML = year;
	var d = new Date(year,month,1);
	var day = d.getDay();
	var totalDays = noOfDays(month,year);
	var now = new Date();
	if(type=='long'){
	var html = "<tr class='day-names'>";
	for(var x = 0; x<7; x++){
		if(x==now.getDay() && month == now.getMonth() && year == now.getFullYear()) html += "<th class='active-day'>"+dayName[x]+"</th>";
		else html += "<th>"+dayName[x]+"</th>";
	}
			
		html += "</tr>";
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
	for(var i = 0; i<6; i++){
		html += "<tr>";
		for(var j = i*7; j< (i+1)*7;j++){
			if(j<day){
				var date = new Date(year, month, 1);
				html += "<td>"+relativeDate(date,j-day+1)+"</td>";
			}
			else if(j<totalDays+day){
				if(type=='long'){
					if(j-day+1 == now.getDate() && month == now.getMonth() && year == now.getFullYear()){
						html += "<td id='"+new Date(year, month, j-day+1).toLocaleDateString('en-US')+"'\
						class='date month-theme today'><div>"+ (j-day+1) +"</div><div class='popup-cont'></div>\
						<div class='events-list'></div>\
						</td>";
					}
					else{
						html += "<td id='"+new Date(year, month, j-day+1).toLocaleDateString('en-US')+"'\
						class='date month-theme'><div>"+ (j-day+1) +"</div><div class='popup-cont'></div>\
						<div class='events-list'></div>\
						</td>";	
					}
					get_events_list(new Date(year, month, j-day+1));
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
				html += "<td>"+ (j-totalDays-day+1) +"</td>";	
			}
		}
		html +="</tr>";
	}
	return html;
}

//clock in left container
function startTime() {
    var today = new Date();
    var h = today.toLocaleString('en-US').split(' ')[1].split(':')[0];
    var m = today.toLocaleString('en-US').split(' ')[1].split(':')[1];
    var period = today.toLocaleString('en-US').split(' ')[2];
    document.getElementById('clock').innerHTML =
    h + ":" + m + '<span>'+period+'</span>';
    var t = setTimeout(startTime, 60000);
}

//converts javascript date to format used in html date type input
function inputDate(date){
	var input_date = date.getFullYear()+'-';
	if(date.getMonth()<9) input_date +='0';
	input_date += (date.getMonth()+1)+'-';
	if(date.getDate()<10) input_date +='0';
	input_date += date.getDate();
	return input_date;
}