from django.db import models

class Supplier(models.Model):
    name = models.CharField(max_length=100, unique=True)

class ExpenseType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    active = models.BooleanField(default=True)

class Expense(models.Model):
    date = models.DateField()
    type = models.ForeignKey(ExpenseType, on_delete=models.PROTECT)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT)
    invoice_numb = models.CharField(max_length=250, unique=True)
    invoice_total = models.DecimalField(max_digits=18, decimal_places=2)
