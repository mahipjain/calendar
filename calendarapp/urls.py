from django.conf.urls import url

from calendarapp import views

urlpatterns = [
	url(r'^$', views.save_event, name='add_event'),
	url(r'^update_event/(?P<event_id>\d+)/$', views.save_event),
	url(r'^events_list/$', views.events_list, name='events_list'),
	url(r'^event/(?P<event_id>\d+)/$', views.event_details),
	url(r'^delete/(?P<event_id>\d+)/$', views.delete),
]

