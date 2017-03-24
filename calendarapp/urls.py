from django.conf.urls import url

from calendarapp import views

urlpatterns = [
	url(r'^$', views.add_event, name='add_event'),
]

