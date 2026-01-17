from django.shortcuts import render,redirect

def login(request):
    return render(request, 'login.html')

def signup(request):
    return render(request,'signup.html')

def logout(request):
    request.session.flush()
    return redirect("/")