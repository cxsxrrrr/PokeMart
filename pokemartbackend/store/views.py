import random

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpResponse

from .models import Orders, Order_details, Listings, Cart, Card

def health_check(request):
    return HttpResponse("OK", content_type="text/plain")


# Cards Endpoints

@csrf_exempt
@require_http_methods(["GET"])
def list_limited_cards(request):
    total_cards = Card.objects.count()
    if total_cards == 0:
        return JsonResponse([], safe=False)

    sample_size = min(30, total_cards)
    max_start_index = max(0, total_cards - sample_size)
    start_index = random.randint(0, max_start_index)
    end_index = start_index + sample_size

    cards = Card.objects.all().order_by("id")[start_index:end_index]

    card_list = [
        {
            "id": card.id,
            "name": card.name,
            "collection": card.collection,
            "rarity": card.rarity,
            "image_url": card.image_url,
            "recommended_price": str(card.recommended_price),
        }
        for card in cards
    ]
    return JsonResponse(card_list, safe=False)


# Cart Endpoints

@csrf_exempt
@require_http_methods(["GET"])
def list_cart_items(request):
    user = request.user
    cart_items = Cart.objects.filter(user_id=user).select_related("listing_id__card_id")
    response_data = []
    for item in cart_items:
        listing = item.listing_id
        card = listing.card_id
        response_data.append(
            {
                "cart_item_id": item.id,
                "quantity": item.quantity,
                "added_at": item.added_at,
                "listing": {
                    "listing_id": listing.id,
                    "price": str(listing.price),
                    "condition": listing.condition,
                    "status": listing.status,
                    "description": listing.description,
                    "card": {
                        "card_id": card.id,
                        "name": card.name,
                        "collection": card.collection,
                        "rarity": card.rarity,
                        "image_url": card.image_url,
                        "recommended_price": str(card.recommended_price),
                    },
                },
            }
        )
    return JsonResponse(response_data, safe=False)