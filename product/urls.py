from django.urls import path
from . import views

urlpatterns = [
    path('<int:productId>/', views.productdetail, name='product_detail'),
    path('addproduct/',views.addproduct,name='addproduct'),
    path('editproduct/<int:productId>/',views.editproduct,name='editproduct'),
    path('allbiddings/<int:productid>/',views.allbiddings,name='allbiddings'),
]
