from django.urls import path
from expenses import views


app_name = 'expenses'

urlpatterns = [
    path('', views.expense_list),
    path('this-month/', views.month_expenses),
    path('<int:pk>/', views.expense_detail),
    path('types/', views.expense_type_list),
    path('types/<int:pk>/', views.expense_type_detail),
    path('suppliers/', views.supplier_list),
]

