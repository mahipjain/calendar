from django.conf.urls import url

from calendarapp import views

urlpatterns = [
	url(r'^$', views.add_event, name='add_event'),
	url(r'^events_list/$', views.events_list, name='events_list'),
]

