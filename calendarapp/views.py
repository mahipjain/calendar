from django.shortcuts import render
from .forms import EventForm
from django.http import HttpResponse, JsonResponse
from .models import Event
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
import json

def is_booked(date, s_time, e_time):
	print s_time, e_time
	#events = Event.objects.filter(date=date).filter(end_time > start_time )
	events = Event.objects.filter(date=date).filter(Q(start_time__range = (s_time, e_time)) | Q(end_time__range = (s_time, e_time)))
	print events
	if events:
		return True
	else:
		return False

@csrf_exempt
def add_event(request):
	if request.method == 'POST':
		event_form = EventForm(request.POST)
		print request.POST['date']
		if event_form.is_valid():
			if is_booked(request.POST['date'], request.POST['start_time'], request.POST['end_time']):
				return HttpResponse("Part of this time slot is already booked.")
			else:
				event = event_form.save()
				return HttpResponse(True)
		else:
			return HttpResponse("Invalid form")
	else:
		return render(request, 'calendarapp/index.html')

@csrf_exempt
def events_list(request):
	date = request.POST.get('date')
	events = Event.objects.filter(date=date).order_by('start_time')
	events_list = []
	for event in events:
		temp = {
				'name': event.name,
				'location': event.location,
				'start_time': str(event.start_time),
				'end_time': str(event.end_time),
				'description': event.description
			}
		events_list.append(temp)
	events_json = json.dumps(events_list)
	return JsonResponse(events_json, safe=False)
