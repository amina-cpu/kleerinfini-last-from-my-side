# Update your products/admin.py
from unfold.admin import ModelAdmin
from django.contrib import admin
from products.models import Product, Category

@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display = ('id', 'name', 'category', 'prix_indicatif', 'est_pret', 'views', 'created_at')
    list_filter = ('category', 'est_pret', 'region_org')
    search_fields = ('name', 'description', 'desc_courte', 'cle_min')
    ordering = ('-created_at',)
    autocomplete_fields = ['category']
    unfold_icon = "fa-solid fa-box"
    unfold_section = "Catalogue"
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'category', 'desc_courte', 'cle_min', 'est_pret')
        }),
        ('Descriptions', {
            'fields': ('description', 'desc_longue')
        }),
        ('Prix et production', {
            'fields': ('prix_indicatif', 'delai_production')
        }),
        ('Médias et documents', {
            'fields': ('images', 'fiche_tech')
        }),
        ('Localisation et langue', {
            'fields': ('region_org', 'langue_du_product')
        }),
        ('Statistiques', {
            'fields': ('views',)
        }),
    )

@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ('id', 'name', 'type', 'description')
    search_fields = ('name', 'type', 'description')
    ordering = ('name',)
    unfold_icon = "fa-solid fa-layer-group"
    unfold_section = "Catalogue"