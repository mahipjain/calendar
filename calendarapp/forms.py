from django import forms
from .models import Event

class EventForm(forms.ModelForm):
	
	class Meta:
		model = Event
		fields = (
					'date',
					'name',
					'location',
					'start_time',
					'end_time',
					'end_time',
					'description',
				)
		widgets = {
					'date':forms.DateInput(attrs={'type':'date'}),
					'start_time':forms.TimeInput(attrs={'type':'time'}),
					'end_time':forms.TimeInput(attrs={'type':'time'}),
				}
