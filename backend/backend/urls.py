from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter

from applications.views import (
    ApplicationViewSet,
    InterviewViewSet,
    ProfileViewSet,
    SkillViewSet,
    RegisterView,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = DefaultRouter()

router.register("applications", ApplicationViewSet)
router.register("interviews", InterviewViewSet)
router.register("profile", ProfileViewSet)
router.register("skills", SkillViewSet)


urlpatterns = [

    # Django Admin
    path("admin/", admin.site.urls),

    # API
    path("api/", include(router.urls)),

    # Registration
    path(
        "api/register/",
        RegisterView.as_view(),
        name="register"
    ),

    # JWT Login
    path(
        "api/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair"
    ),

    # JWT Refresh
    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh"
    ),
]


# Media files
urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)