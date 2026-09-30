from django.contrib.auth.models import User

from rest_framework import serializers

from .models import (
    Application,
    Interview,
    Profile,
    Skill,
)


class ApplicationSerializer(serializers.ModelSerializer):

    class Meta:

        model = Application

        fields = "__all__"

        read_only_fields = ["user"]


class InterviewSerializer(serializers.ModelSerializer):

    class Meta:

        model = Interview

        fields = "__all__"

        read_only_fields = ["user"]


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = Profile

        fields = "__all__"

        read_only_fields = ["user"]


class SkillSerializer(serializers.ModelSerializer):

    class Meta:

        model = Skill

        fields = "__all__"

        read_only_fields = ["user"]


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:

        model = User

        fields = [
            "username",
            "password",
        ]

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"]
        )

        return user