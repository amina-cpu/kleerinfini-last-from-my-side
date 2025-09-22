from django.urls import path
from .views import InviteClientView, RegisterInviteGetView, RegisterInvitePostView

urlpatterns = [
    path('admin/invite-client/', InviteClientView.as_view(), name='invite_client'),
    path('register/invite/<str:token>/', RegisterInviteGetView.as_view(), name='register_invite_get'),
    path('register/invite/<str:token>/', RegisterInvitePostView.as_view(), name='register_invite_post'),
] 