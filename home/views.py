from django.shortcuts import render
from database.views import products

def home(request):
    return render(request, 'home.html')

def posts(request):
    return products(request)