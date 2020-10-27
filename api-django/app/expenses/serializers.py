from rest_framework import serializers

from core.models import Expense, ExpenseType, Supplier


class ExpenseSerializer(serializers.ModelSerializer):
    """Serializer for Expense objects"""
    class Meta:
        model = Expense
        fields = ('id', 'date', 'type', 'supplier', 'invoice_numb', 'invoice_total',)
        read_only_fields = ('id',)
        depth=1

class ExpenseSimpleSerializer(serializers.ModelSerializer):
    """Serializer for Expense objects"""
    class Meta:
        model = Expense
        fields = ('id', 'date', 'type', 'supplier', 'invoice_numb', 'invoice_total',)
        read_only_fields = ('id',)

class ExpenseTypeSerializer(serializers.ModelSerializer):
    """Serializer for ExpenseType objects"""

    class Meta:
        model = ExpenseType
        fields = ('id', 'name', 'active',)
        read_only_fields = ('id',)

class SupplierSerializer(serializers.ModelSerializer):
    """Serializer for Supplier objects"""

    class Meta:
        model = Supplier
        fields = ('id', 'name',)
        read_only_fields = ('id',)