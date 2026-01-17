from django.shortcuts import render
from database import views

def profile(request):
    return render(request, 'profile.html')

def user_details(request):
    return views.userdetails(request)

def userdetailsedit(request):
    return views.userdetailsedit(request)