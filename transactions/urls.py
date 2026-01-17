# transactions/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("placebid/", views.placebid, name="place_bid"),
    path("productpostedcount/",views.productspostedcount,name="productpostedcount"),
    path("biddingspostedcount/",views.biddingspostedcount,name='biddingspostedcount'),
    path("mybiddings/",views.mybiddings,name='mybiddings'),
    path('myorders/',views.myorders,name='myorders'),
    path('orderdetails/<str:orderid>/<int:productid>/',views.orderdetails,name='orderdetails'),
    path('myproducts/',views.myproducts,name='myproducts'),
    path('addproduct/',views.addproduct,name='addproduct'),
    path('updateproduct/',views.updateproduct,name='updateproduct'),
    path('biddingverdict/',views.biddingverdict,name='biddingverdict'),
    path('makeorder/',views.makeorder,name='makeorder'),
    path("createtransaction/<str:order_id>/",views.createtransaction ,name='createtransaction'),
    path("createtransportation/<str:order_id>/", views.createtransportation,name='createtransportation'),
    path("orders/details/<str:order_id>/", views.orderdetails,name='orderdetails'),
    path('myproducts/endbid/<int:productid>/',views.endbid,name='endbid'),
]
