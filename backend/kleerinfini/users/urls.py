from django.urls import path
from .views import RegisterProducerView, LoginView

urlpatterns = [
    path('register/producer/', RegisterProducerView.as_view(), name='register_producer'),
    path('login/', LoginView.as_view(), name='login'),
] 