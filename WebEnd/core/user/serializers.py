from rest_framework import serializers
from .models import *

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'Feedback_date', 'Feedback_name', 'Feedback_txt', 'verification_key', 'status']
class ImageAttachmentSerializer(serializers.ModelSerializer):
    feedback = serializers.PrimaryKeyRelatedField(queryset=Feedback.objects.all())
    class Meta:
        model = ImageAttachment
        fields = ['feedback', 'image']

class managerSerializer(serializers.ModelSerializer):
    class Meta:
        model = mфanager
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = manager(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class FeedbackResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackResponse
        fields = ['id', 'Response_theme', 'Response_txt', 'feedback', 'manager', 'Response_date', 'Edited', 'Category']

class ImageResponseSerializer(serializers.ModelSerializer):
    response = serializers.PrimaryKeyRelatedField(queryset=FeedbackResponse.objects.all())
    class Meta:
        model = ImageResponse
        fields = ['responseID', 'image']