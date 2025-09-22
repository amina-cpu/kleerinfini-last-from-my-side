from rest_framework import serializers
from .models import Invitation

class InviteClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ['email'] 