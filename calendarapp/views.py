from django.shortcuts import render, get_object_or_404
from .forms import EventForm
from django.http import HttpResponse, JsonResponse
from .models import Event
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
import json
from django.utils import timezone
from datetime import datetime

def is_booked(s_datetime,e_datetime):
	#events = Event.objects.filter(date=date).filter(end_time > start_time )
	events = Event.objects.filter(Q(start_datetime__range = (s_datetime, e_datetime)) | Q(end_datetime__range = (s_datetime, e_datetime)))
	print events
	if events:
		return True
	else:
		return False

@csrf_exempt
def save_event(request, event_id = None):
	print event_id
	if request.method == 'POST':
		event_form = EventForm(request.POST)
		#print request.POST['start_date']
		if event_form.is_valid():
			s_date = request.POST['start_date']
			e_date = request.POST['end_date']
			s_time = request.POST['start_time']
			e_time = request.POST['end_time']
			print s_date, s_time, e_date, e_time
			s_datetime = datetime.strptime(s_date+'-'+s_time, '%Y-%m-%d-%H:%M:%S')
			e_datetime = datetime.strptime(e_date+'-'+e_time, '%Y-%m-%d-%H:%M:%S')
			#if is_booked(s_datetime, e_datetime):
			#	return HttpResponse("Part of this time slot is already booked.")
			#else:
			if event_id != None:
				event_to_edit = get_object_or_404(Event, pk=event_id)
				event_to_edit.name = request.POST['name']
				event_to_edit.location= request.POST['location']
				event_to_edit.description = request.POST['description']
				event_to_edit.start_datetime = s_datetime
				event_to_edit.end_datetime = e_datetime
				event_to_edit.save()
				return HttpResponse(True)
			
			else:
				event = event_form.save(commit=False)
				event.start_datetime = s_datetime
				event.end_datetime = e_datetime
				event.save()
				return HttpResponse(True)
		else:
			return HttpResponse("Invalid form")
	else:
		return render(request, 'calendarapp/index.html')

@csrf_exempt
def events_list(request):
	date = request.POST.get('date')
	#print date
	events = Event.objects.filter(start_datetime__date__lte = date).filter(end_datetime__date__gte = date).order_by('start_datetime')
	events_list = []
	for event in events:
		temp = {
				'id': event.id,
				'name': event.name,
				'location': event.location,
				'start_time': str(event.start_datetime.time()),
				'end_time': str(event.end_datetime.time()),
				'description': event.description
			}
		events_list.append(temp)
	events_json = json.dumps(events_list)
	return JsonResponse(events_json, safe=False)

@csrf_exempt
def event_details(request, event_id):
	event = get_object_or_404(Event, pk = event_id)
	event_dict = {
					'id': event.id,
					'name': event.name,
					'location': event.location,
					'start_datetime': event.start_datetime.strftime("%I:%M %p, %A, %b %y"),
					'end_datetime': event.end_datetime.strftime("%I:%M %p, %A, %b %y"),
					'start_date': event.start_datetime.strftime("%Y-%m-%d"),
					'end_date': event.end_datetime.strftime("%Y-%m-%d"),
					'start_time': event.start_datetime.strftime("%H:%M:%S"),
					'end_time': event.end_datetime.strftime("%H:%M:%S"),
					'description': event.description
				}
	details_json = json.dumps(event_dict)
	return JsonResponse(details_json, safe=False)

@csrf_exempt
def delete(request, event_id):
	event = get_object_or_404(Event, pk = event_id)
	event.delete()
	return HttpResponse('Event deleted.')
