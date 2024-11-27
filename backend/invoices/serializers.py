from rest_framework import serializers
from .models import Invoice, InvoiceDetail

class InvoiceDetailSerializer(serializers.ModelSerializer):
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = InvoiceDetail
        fields = [
            'id', 'description', 'quantity', 
            'unit_price', 'line_total'
        ]

    def get_line_total(self, obj):
        return obj.quantity * obj.unit_price

class InvoiceSerializer(serializers.ModelSerializer):
    details = InvoiceDetailSerializer(many=True)
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'customer_name', 
            'date', 'details', 'total_amount'
        ]

    def create(self, validated_data):
        details_data = validated_data.pop('details', [])
        invoice = Invoice.objects.create(**validated_data)

        for detail_data in details_data:
            detail_data['line_total'] = detail_data['quantity'] * detail_data['unit_price']
            InvoiceDetail.objects.create(invoice=invoice, **detail_data)

        invoice.update_total_amount()
        return invoice

    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', [])
        
        # Update invoice fields
        instance.invoice_number = validated_data.get('invoice_number', instance.invoice_number)
        instance.customer_name = validated_data.get('customer_name', instance.customer_name)
        instance.date = validated_data.get('date', instance.date)
        instance.save()

        # Delete existing details and recreate
        instance.details.all().delete()
        
        for detail_data in details_data:
            detail_data['line_total'] = detail_data['quantity'] * detail_data['unit_price']
            InvoiceDetail.objects.create(invoice=instance, **detail_data)

        instance.update_total_amount()
        return instance

    def validate(self, data):
        if not data.get('details'):
            raise serializers.ValidationError("Invoice must have at least one detail")
        return data