from django.shortcuts import render
import json
from database import views
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

def placebid(request):
    data = json.loads(request.body)
    bid_quantity = data["quantity"]
    bid_price = data["price"]
    email = request.session.get('email')
    product_id = data["product_id"]
    id=views.getId(email)
    return views.placebid(request, bid_quantity, bid_price, id, product_id)


def productspostedcount(request):
    email=request.session.get('email')
    id=views.getId(email)
    return views.productspostedcount(request,id)


def biddingspostedcount(request):
    email=request.session.get('email')
    id=views.getId(email)
    return views.biddingspostedcount(request,id)


def mybiddings(request):
    email = request.session.get('email')
    user_id = views.getId(email)

    biddings = views.mybiddings(request, user_id)

    return render(request, "biddings.html", {
        "biddings": biddings
    })

def myorders(request):
    email=request.session.get('email')
    id=views.getId(email)
    orders=views.myorders(request,id)
    return render(request,'myorders.html',{'orders':orders})


def orderdetails(request, orderid, productid):
    email = request.session.get('email')
    userid = views.getId(email)

    # Call helper (returns JsonResponse)
    response = views.transaction(request, userid, orderid, productid)

    # Convert JsonResponse → Python dict
    data = json.loads(response.content)

    # Pass only the order object to template
    return render(request, 'order.html', {
        'order': data['order']
    })


def myproducts(request):
    email = request.session.get('email')
    userid = views.getId(email)

    response = views.myproducts(request, userid)
    data = json.loads(response.content)

    return render(
        request,
        'myproducts.html',{'products': data['products']
        })



def addproduct(request):
    if request.method == "POST":
        try:
            product = json.loads(request.body)
            return views.addproduct(request, product)
        except Exception as e:
            return JsonResponse({
                "success": False,
                "error": str(e)
            }, status=400)

    return JsonResponse({
        "success": False,
        "error": "Invalid request method"
    }, status=405)

@csrf_exempt
def updateproduct(request):
    return views.updateproduct(request)


@csrf_exempt
def biddingverdict(request):
    body = json.loads(request.body)
    biddingid = body["biddingid"]
    verdict = body["verdict"]
    return views.biddingverdict(request, biddingid, verdict)

@csrf_exempt
def makeorder(request):
    email = request.session.get('email')
    id = views.getId(email)
    data = json.loads(request.body)
    return views.makeorder(request, data['biddingid'], id)



@csrf_exempt
def createtransaction(request,order_id):
    return views.createtransaction(request,order_id)

@csrf_exempt
def createtransportation(request,order_id):
    return views.createtransportation(request,order_id)


@csrf_exempt
def orderdetails(request, order_id):
    response = views.orderdetails_helper(request, order_id)

    data = json.loads(response.content)

    if data.get("status") != "success":
        return render(request, "orderdetail.html", {
            "error": data.get("message")
        })

    return render(
        request,
        "orderdetail.html",
        data["data"]
    )


@csrf_exempt
def endbid(request,productid):
    return views.endbid(request,productid)