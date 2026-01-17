from django.urls import path
from . import views

urlpatterns = [
    path('', views.profile, name='profile'),
    path('userdetails/',views.user_details,name='userdetails'),
    path('userdetails/edit/',views.userdetailsedit,name='edit'),
]
