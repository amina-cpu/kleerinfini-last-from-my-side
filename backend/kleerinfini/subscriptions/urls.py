from django.urls import path
from .views import UploadProofView
from .views import ValidateSubscriptionView

urlpatterns = [
    path('producer/upload-proof/', UploadProofView.as_view(), name='upload_proof'),
    path('admin/validate-subscription/', ValidateSubscriptionView.as_view(), name='validate_subscription'),
] 