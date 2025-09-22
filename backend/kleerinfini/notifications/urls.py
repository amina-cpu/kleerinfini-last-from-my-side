from django.urls import path
from .views import NotificationListView, NotificationMarkReadView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notifications_list'),
    path('notifications/mark-read/', NotificationMarkReadView.as_view(), name='notifications_mark_read'),
] 