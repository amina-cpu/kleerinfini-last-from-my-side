from unfold.admin import ModelAdmin
from django.contrib import admin
from .models import ProducerProfile

@admin.register(ProducerProfile)
class ProducerProfileAdmin(ModelAdmin):
    list_display = ('id', 'user', 'company_name', 'phone', 'address')
    search_fields = ('user__email', 'company_name', 'phone')
    ordering = ('company_name',)
    unfold_icon = "fa-solid fa-user-tie"
    unfold_section = "Utilisateurs"
    fieldsets = (
        (None, {
            'fields': ('user', 'company_name', 'phone', 'address')
        }),
    )
