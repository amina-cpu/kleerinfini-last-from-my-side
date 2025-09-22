from unfold.admin import ModelAdmin
from django.contrib import admin
from .models import Invitation

@admin.register(Invitation)
class InvitationAdmin(ModelAdmin):
    list_display = ('id', 'email', 'token', 'expires_at', 'used')
    search_fields = ('email', 'token')
    ordering = ('-expires_at',)
    list_filter = ('used',)
    unfold_icon = "fa-solid fa-envelope-open-text"
    unfold_section = "Clients"
