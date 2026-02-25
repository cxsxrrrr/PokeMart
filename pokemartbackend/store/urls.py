from django.urls import path
from . import views

urlpatterns = [
    # Health
    path('health/', views.health_check, name='health_check'),

    # Cards
    path('cards/', views.list_limited_cards, name='list_limited_cards'),
    path('cards/search/', views.search_cards, name='search_cards'),
    path('cards/<int:card_id>/', views.get_card, name='get_card'),

    # Listings
    path('listings/', views.list_listings, name='list_listings'),
    path('listings/create/', views.create_listing, name='create_listing'),
    path('listings/<int:listing_id>/', views.get_listing, name='get_listing'),
    path('listings/<int:listing_id>/update/', views.update_listing, name='update_listing'),
    path('listings/<int:listing_id>/delete/', views.delete_listing, name='delete_listing'),

    # Cart
    path('cart/', views.list_cart_items, name='list_cart_items'),
    path('cart/add/', views.add_cart_item, name='add_cart_item'),
    path('cart/<int:cart_item_id>/update/', views.update_cart_item, name='update_cart_item'),
    path('cart/<int:cart_item_id>/delete/', views.delete_cart_item, name='delete_cart_item'),

    # Orders
    path('orders/', views.list_orders, name='list_orders'),
    path('orders/create/', views.create_order, name='create_order'),
    path('orders/<int:order_id>/', views.get_order, name='get_order'),

    # Reviews
    path('reviews/create/', views.create_review, name='create_review'),
    path('reviews/<int:order_id>/', views.get_review, name='get_review'),
]