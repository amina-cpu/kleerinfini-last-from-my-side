from rest_framework import serializers
from .models import Subscription

class UploadProofSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['proof_file_url', 'payment_method']

class ValidateSubscriptionSerializer(serializers.Serializer):
    id = serializers.UUIDField() 