from django.contrib import admin
from .models import Customer, Category, Product, Order, OrderItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'category',
        'price',
        'brand',
        'stock',
        'discount',
    )

    list_filter = (
        'category',
        'brand',
    )

    search_fields = (
        'name',
        'brand',
        'description',
    )


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'email',
        'phone',
        'created_at',
    )

    search_fields = (
        'name',
        'email',
        'phone',
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'user',
        'total_price',
        'status',
        'payment_method',
        'created_at',
    )

    list_filter = (
        'status',
        'payment_method',
    )

    search_fields = (
        'name',
        'phone',
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        'order',
        'product',
        'quantity',
        'price',
    )