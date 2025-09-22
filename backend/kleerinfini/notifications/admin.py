from unfold.admin import ModelAdmin
from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(ModelAdmin):
    list_display = ('id', 'user', 'type', 'is_read', 'created_at')
    list_filter = ('type', 'is_read')
    search_fields = ('user__email', 'message', 'type')
    ordering = ('-created_at',)
    autocomplete_fields = ['user']
    unfold_icon = "fa-solid fa-bell"
    unfold_section = "Notifications"
