from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Model for customers 
class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
# Model for Products

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
# Models for order

class Order(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
    ]
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    PAYMENT_CHOICE = {
        ('COD', 'Cash on Delivery'),
        ('CARD', 'Card'),
    }

    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICE)   

    def __str__(self):
        return self.name
    
# Models for Ordered Items

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveBigIntegerField(default=1)
    price = models.DecimalField(
        max_digits= 10,
        decimal_places= 2
    )

    def get_total(self):
        return self.quantity * self.price

    def __str__(self):
        return f"{self.product.name} * {self.quantity}"