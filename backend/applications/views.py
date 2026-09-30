from rest_framework import viewsets, generics

from rest_framework.permissions import IsAuthenticated

from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)

from .models import (
    Application,
    Interview,
    Profile,
    Skill,
)

from .serializers import (
    ApplicationSerializer,
    InterviewSerializer,
    ProfileSerializer,
    SkillSerializer,
    RegisterSerializer,
)


class ApplicationViewSet(viewsets.ModelViewSet):

    queryset = Application.objects.all()

    serializer_class = ApplicationSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class InterviewViewSet(viewsets.ModelViewSet):

    queryset = Interview.objects.all()

    serializer_class = InterviewSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Interview.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class ProfileViewSet(viewsets.ModelViewSet):

    queryset = Profile.objects.all()

    serializer_class = ProfileSerializer

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_queryset(self):
        return Profile.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class SkillViewSet(viewsets.ModelViewSet):

    queryset = Skill.objects.all()

    serializer_class = SkillSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Skill.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class RegisterView(generics.CreateAPIView):

    serializer_class = RegisterSerializer