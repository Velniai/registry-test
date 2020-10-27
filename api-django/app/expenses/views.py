from datetime import datetime, date, timedelta
from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import Lower
from django.db.models import Sum
from core.models import ExpenseType, Expense, Supplier
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from expenses import serializers

@api_view(['GET','POST'])
def expense_type_list(request):
    if request.method == 'GET':
        expense_types = ExpenseType.objects.order_by('-active', Lower('name'))
        serializer = serializers.ExpenseTypeSerializer(expense_types, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = serializers.ExpenseTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
def expense_type_detail(request, pk):
    try:
        expense_type = ExpenseType.objects.get(pk=pk)
    except ExpenseType.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = serializers.ExpenseTypeSerializer(expense_type)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = serializers.ExpenseTypeSerializer(expense_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET','POST'])
def expense_list(request):
    if request.method == 'GET':
        expense = Expense.objects
        
        types_f = request.GET.get('type')
        date_f = request.GET.get('date')
        if types_f:
            expense = expense.filter(type=types_f)
        if date_f:
            if date_f == 'today':
                filt = date.today()
                expense = expense.filter(date=filt)
            elif date_f == 'week':
                wd = date.today().weekday()
                filt = date.today() - timedelta(days=wd)
                expense = expense.filter(date__gte=filt)
            elif date_f == 'month':
                filt = date.today().replace(day=1)
                expense = expense.filter(date__gte=filt)
            elif date_f == 'prev':
                filt_to = date.today().replace(day=1) - timedelta(days=1)
                filt_from = filt_to.replace(day=1)
                expense = expense.filter(date__gte=filt_from, date__lte=filt_to)

        expense = expense.order_by('-date')
        serializer = serializers.ExpenseSerializer(expense, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = serializers.ExpenseSimpleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def expense_detail(request, pk):
    try:
        expense = Expense.objects.get(pk=pk)
    except Expense.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = serializers.ExpenseSerializer(expense)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = serializers.ExpenseSimpleSerializer(expense, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        expense.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def month_expenses(request):
     today = datetime.today().replace(day=1)
     expenses = Expense.objects.filter(date__gte=today).aggregate(Sum('invoice_total'))
     return Response({'month_expenses': expenses['invoice_total__sum']})

@api_view(['GET','POST'])
def supplier_list(request):
    if request.method == 'GET':
        suppliers = Supplier.objects.all()
        serializer = serializers.SupplierSerializer(suppliers, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = serializers.SupplierSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)