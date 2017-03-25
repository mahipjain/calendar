from __future__ import unicode_literals
from django.db import models

class Event(models.Model):
	date = models.DateField()
	name = models.CharField(max_length=50)
	location = models.CharField(max_length=100, null=True, blank=True)
	start_time = models.TimeField()
	end_time = models.TimeField()
	description = models.TextField(null=True, blank=True)

	def __str__(self):
		return self.name
