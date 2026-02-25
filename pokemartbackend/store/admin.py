from django.contrib import admin
from .models import Card, Listings, Cart, Orders, Order_details, Reviews


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'collection', 'rarity', 'recommended_price')
    search_fields = ('name', 'collection')
    list_filter = ('rarity', 'collection')


@admin.register(Listings)
class ListingsAdmin(admin.ModelAdmin):
    list_display = ('id', 'seller', 'card_id', 'price', 'quantity', 'condition', 'status', 'created_at')
    search_fields = ('card_id__name',)
    list_filter = ('status', 'condition')


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'listing_id', 'quantity', 'added_at')


@admin.register(Orders)
class OrdersAdmin(admin.ModelAdmin):
    list_display = ('id', 'buyer_id', 'total_price', 'status', 'created_at')
    list_filter = ('status',)


@admin.register(Order_details)
class OrderDetailsAdmin(admin.ModelAdmin):
    list_display = ('id', 'order_id', 'listing_id', 'quantity', 'unit_price')


@admin.register(Reviews)
class ReviewsAdmin(admin.ModelAdmin):
    list_display = ('id', 'order_id', 'rating', 'created_at')
    list_filter = ('rating',)
