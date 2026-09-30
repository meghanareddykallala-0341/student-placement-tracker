from django.db import models


class Application(models.Model):
    user = models.ForeignKey(
        "auth.User",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    company = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    applied_date = models.DateField()
    deadline = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.company


class Interview(models.Model):
    user = models.ForeignKey(
        "auth.User",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    company = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.company


class Profile(models.Model):
    user = models.ForeignKey(
        "auth.User",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    college = models.CharField(max_length=150)
    degree = models.CharField(max_length=100)
    cgpa = models.FloatField()
    graduation_year = models.IntegerField()

    resume = models.FileField(
        upload_to="resumes/",
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name



class Skill(models.Model):
    user = models.ForeignKey(
        "auth.User",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    name = models.CharField(max_length=100)
    category = models.CharField(
    max_length=100,
    default="Programming"
)
    level = models.CharField(max_length=50)

    def __str__(self):
        return self.name

