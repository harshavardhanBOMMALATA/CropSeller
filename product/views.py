from django.shortcuts import render
from database import views
import json
from django.conf import settings

# Create your views here.

def productdetail(request,productId):
    product=views.productdetail(request,productId)
    producthistory=views.producthistory(request,productId)

    producthistory=json.loads(producthistory.content.decode('utf-8'))
    product=json.loads(product.content.decode('utf-8'))
    
    return render(request,'product.html',{'product':product,'history':producthistory})


def addproduct(request):
    return render(request, "addproduct.html", {
        "cloud_name": settings.CLOUDINARY_CLOUD_NAME,
        "upload_preset": settings.CLOUDINARY_UPLOAD_PRESET,
    })


def editproduct(request,productId):
    product=views.productdetail(request,productId)

    product=json.loads(product.content.decode('utf-8'))
    
    return render(request,'editproduct.html',{'product':product})

def allbiddings(request, productid):
    response = views.allbiddings(request, productid)

    data = json.loads(response.content.decode("utf-8"))

    return render(request, "allbiddings.html", {
        "product": data["product"],
        "summary": data["summary"],
        "weekly": data["weekly"],
        "bids": data["bids"]
    })
