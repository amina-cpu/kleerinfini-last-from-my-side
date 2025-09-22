from unfold.admin import ModelAdmin
from django.contrib import admin
from products.models import Product, Category

@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display = ('id', 'name', 'category', 'views', 'created_at')
    list_filter = ('category',)
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
    autocomplete_fields = ['category']
    unfold_icon = "fa-solid fa-box"
    unfold_section = "Catalogue"
    fieldsets = (
    (None, {
        'fields': ('name', 'category', 'description', 'views')
    }),
)

@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ('id', 'name', 'type', 'description')
    search_fields = ('name', 'type', 'description')
    ordering = ('name',)
    unfold_icon = "fa-solid fa-layer-group"
    unfold_section = "Catalogue"
