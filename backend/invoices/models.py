from django.db import models
from django.core.validators import MinValueValidator
from django.db.models import Sum

class Invoice(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    customer_name = models.CharField(max_length=200)
    date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def update_total_amount(self):
        # Recalculate total amount based on details
        self.total_amount = self.details.aggregate(
            total=Sum('line_total')
        )['total'] or 0
        self.save()

    def __str__(self):
        return f"{self.invoice_number} - {self.customer_name}"

class InvoiceDetail(models.Model):
    invoice = models.ForeignKey(
        Invoice, 
        related_name='details', 
        on_delete=models.CASCADE
    )
    description = models.CharField(max_length=255)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        # Compute line total before saving
        self.line_total = self.quantity * self.unit_price
        super().save(*args, **kwargs)
        
        # Update invoice total
        self.invoice.update_total_amount()

    def __str__(self):
        return f"{self.description} - {self.line_total}"