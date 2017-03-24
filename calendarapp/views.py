from django.shortcuts import render
from .forms import EventForm
from django.http import HttpResponse
from .models import Event
from django.db.models import Q

def is_booked(date, s_time, e_time):
	#events = Event.objects.filter(date=date).filter(end_time > start_time )
	events = Event.objects.filter(date=date).filter(Q(start_time__range = (s_time, e_time)) | Q(end_time__range = (s_time, e_time)))
	if events:
		return True
	else:
		return False

def add_event(request):
	if request.method == 'POST':
		event_form = EventForm(request.POST)
		if event_form.is_valid():
			if is_booked(request.POST['date'], request.POST['start_time'], request.POST['end_time']):
				return HttpResponse("Part of this time slot is already booked.")
			else:
				event = event_form.save()
				return HttpResponse(True)
		else:
			return HttpResponse("Invalid form")
	
	else:
		event_form = EventForm()
		return render(request, 'calendarapp/index.html', {'even_form':event_form})

