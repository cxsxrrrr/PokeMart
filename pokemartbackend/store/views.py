import json
import random

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpResponse
from django.db import transaction

from .models import Orders, Order_details, Listings, Cart, Card, Reviews, Message


def health_check(request):
    return HttpResponse("OK", content_type="text/plain")


# ─── Cards Endpoints ───────────────────────────────────────────────────────────

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


@csrf_exempt
@require_http_methods(["GET"])
def get_card(request, card_id):
    try:
        card = Card.objects.get(id=card_id)
    except Card.DoesNotExist:
        return JsonResponse({"error": "Card not found."}, status=404)

    return JsonResponse({
        "id": card.id,
        "name": card.name,
        "collection": card.collection,
        "rarity": card.rarity,
        "image_url": card.image_url,
        "recommended_price": str(card.recommended_price),
    })


@csrf_exempt
@require_http_methods(["GET"])
def search_cards(request):
    query = request.GET.get("q", "").strip()
    if not query:
        return JsonResponse({"error": "Query parameter 'q' is required."}, status=400)

    cards = Card.objects.filter(name__icontains=query).order_by("name")[:50]
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


# ─── Listings Endpoints ────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["GET"])
def list_listings(request):
    listings = Listings.objects.filter(status__in=["Available", "Disponible"]).select_related("card_id", "seller").order_by("-created_at")

    data = [
        {
            "id": listing.id,
            "seller": {
                "id": listing.seller.id,
                "username": listing.seller.username,
            },
            "card": {
                "id": listing.card_id.id,
                "name": listing.card_id.name,
                "collection": listing.card_id.collection,
                "rarity": listing.card_id.rarity,
                "image_url": listing.card_id.image_url,
                "recommended_price": str(listing.card_id.recommended_price),
            },
            "price": str(listing.price),
            "quantity": listing.quantity,
            "condition": listing.condition,
            "status": listing.status,
            "description": listing.description,
            "created_at": listing.created_at.isoformat(),
        }
        for listing in listings
    ]
    return JsonResponse(data, safe=False)


@csrf_exempt
@require_http_methods(["GET"])
def get_listing(request, listing_id):
    try:
        listing = Listings.objects.select_related("card_id", "seller").get(id=listing_id)
    except Listings.DoesNotExist:
        return JsonResponse({"error": "Listing not found."}, status=404)

    return JsonResponse({
        "id": listing.id,
        "seller": {
            "id": listing.seller.id,
            "username": listing.seller.username,
        },
        "card": {
            "id": listing.card_id.id,
            "name": listing.card_id.name,
            "collection": listing.card_id.collection,
            "rarity": listing.card_id.rarity,
            "image_url": listing.card_id.image_url,
            "recommended_price": str(listing.card_id.recommended_price),
        },
        "price": str(listing.price),
        "quantity": listing.quantity,
        "condition": listing.condition,
        "status": listing.status,
        "description": listing.description,
        "created_at": listing.created_at.isoformat(),
    })


@csrf_exempt
@require_http_methods(["POST"])
def create_listing(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    required_fields = {"card_id", "price", "quantity", "condition"}
    if not required_fields.issubset(payload):
        return JsonResponse({"error": "Missing required fields: card_id, price, quantity, condition."}, status=400)

    try:
        card = Card.objects.get(id=payload["card_id"])
    except Card.DoesNotExist:
        return JsonResponse({"error": "Card not found."}, status=404)

    listing = Listings.objects.create(
        seller=request.user,
        card_id=card,
        price=payload["price"],
        quantity=payload["quantity"],
        condition=payload["condition"],
        status=payload.get("status", "Available"),
        description=payload.get("description", ""),
    )

    return JsonResponse({
        "id": listing.id,
        "seller_id": listing.seller.id,
        "card_id": listing.card_id.id,
        "price": str(listing.price),
        "quantity": listing.quantity,
        "condition": listing.condition,
        "status": listing.status,
        "description": listing.description,
        "created_at": listing.created_at.isoformat(),
    }, status=201)


@csrf_exempt
@require_http_methods(["PUT"])
def update_listing(request, listing_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    try:
        listing = Listings.objects.get(id=listing_id, seller=request.user)
    except Listings.DoesNotExist:
        return JsonResponse({"error": "Listing not found or not owned by you."}, status=404)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    if "price" in payload:
        listing.price = payload["price"]
    if "quantity" in payload:
        listing.quantity = payload["quantity"]
    if "condition" in payload:
        listing.condition = payload["condition"]
    if "status" in payload:
        listing.status = payload["status"]
    if "description" in payload:
        listing.description = payload["description"]

    listing.save()

    return JsonResponse({
        "id": listing.id,
        "price": str(listing.price),
        "quantity": listing.quantity,
        "condition": listing.condition,
        "status": listing.status,
        "description": listing.description,
    })


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_listing(request, listing_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    try:
        listing = Listings.objects.get(id=listing_id, seller=request.user)
    except Listings.DoesNotExist:
        return JsonResponse({"error": "Listing not found or not owned by you."}, status=404)

    listing.delete()
    return JsonResponse({"message": "Listing deleted successfully."})


# ─── Cart Endpoints ─────────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["GET"])
def list_cart_items(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    cart_items = Cart.objects.filter(user_id=request.user).select_related("listing_id__card_id")
    response_data = []
    for item in cart_items:
        listing = item.listing_id
        card = listing.card_id
        response_data.append(
            {
                "cart_item_id": item.id,
                "quantity": item.quantity,
                "added_at": item.added_at.isoformat(),
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


@csrf_exempt
@require_http_methods(["POST"])
def add_cart_item(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    required_fields = {"listing_id", "quantity"}
    if not required_fields.issubset(payload):
        return JsonResponse({"error": "Missing required fields: listing_id, quantity."}, status=400)

    try:
        listing = Listings.objects.get(id=payload["listing_id"])
    except Listings.DoesNotExist:
        return JsonResponse({"error": "Listing not found."}, status=404)

    if listing.status != "Available":
        return JsonResponse({"error": "Listing is not available."}, status=400)

    # Check if item already in cart — update quantity instead
    existing = Cart.objects.filter(user_id=request.user, listing_id=listing).first()
    if existing:
        existing.quantity += int(payload["quantity"])
        existing.save()
        return JsonResponse({
            "cart_item_id": existing.id,
            "listing_id": existing.listing_id.id,
            "quantity": existing.quantity,
            "added_at": existing.added_at.isoformat(),
        })

    cart_item = Cart.objects.create(
        user_id=request.user,
        listing_id=listing,
        quantity=payload["quantity"],
    )

    return JsonResponse({
        "cart_item_id": cart_item.id,
        "listing_id": cart_item.listing_id.id,
        "quantity": cart_item.quantity,
        "added_at": cart_item.added_at.isoformat(),
    }, status=201)


@csrf_exempt
@require_http_methods(["PUT"])
def update_cart_item(request, cart_item_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    try:
        cart_item = Cart.objects.get(id=cart_item_id, user_id=request.user)
    except Cart.DoesNotExist:
        return JsonResponse({"error": "Cart item not found."}, status=404)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    if "quantity" not in payload:
        return JsonResponse({"error": "Missing required field: quantity."}, status=400)

    cart_item.quantity = payload["quantity"]
    cart_item.save()

    return JsonResponse({
        "cart_item_id": cart_item.id,
        "listing_id": cart_item.listing_id.id,
        "quantity": cart_item.quantity,
    })


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_cart_item(request, cart_item_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    try:
        cart_item = Cart.objects.get(id=cart_item_id, user_id=request.user)
    except Cart.DoesNotExist:
        return JsonResponse({"error": "Cart item not found."}, status=404)

    cart_item.delete()
    return JsonResponse({"message": "Cart item removed successfully."})


# ─── Orders Endpoints ───────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["POST"])
def create_order(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    cart_items = Cart.objects.filter(user_id=request.user).select_related("listing_id")

    if not cart_items.exists():
        return JsonResponse({"error": "Cart is empty."}, status=400)

    with transaction.atomic():
        # Agrupar items por vendedor
        items_by_seller = {}
        for item in cart_items:
            seller_id = item.listing_id.seller.id
            if seller_id not in items_by_seller:
                items_by_seller[seller_id] = []
            items_by_seller[seller_id].append(item)

        created_orders = []
        for seller_id, items in items_by_seller.items():
            total_price = sum(item.listing_id.price * item.quantity for item in items)
            
            order = Orders.objects.create(
                buyer_id=request.user,
                total_price=total_price,
                status="Pendiente",
            )
            
            order_details_list = [
                Order_details(
                    order_id=order,
                    listing_id=item.listing_id,
                    quantity=item.quantity,
                    unit_price=item.listing_id.price,
                )
                for item in items
            ]
            Order_details.objects.bulk_create(order_details_list)
            created_orders.append(order)

        # Clear the cart
        cart_items.delete()

    return JsonResponse({
        "orders": [
            {
                "id": o.id,
                "total_price": str(o.total_price),
                "status": o.status,
                "items": [
                    {
                        "name": d.listing_id.card_id.name,
                        "quantity": d.quantity
                    } for d in o.order_details.all()
                ]
            } for o in created_orders
        ]
    }, status=201)



@csrf_exempt
@require_http_methods(["GET"])
def list_orders(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    # Compras: órdenes donde soy el comprador
    orders = Orders.objects.filter(buyer_id=request.user).order_by("-created_at")

    data = []
    for order in orders:
        # Intentar obtener la primera carta de la orden para el icono/nombre
        first_detail = Order_details.objects.filter(order_id=order).select_related("listing_id__card_id").first()
        data.append({
            "id": order.id,
            "type": "order",
            "total_price": float(order.total_price),
            "status": order.status,
            "created_at": order.created_at.isoformat(),
            "item_name": first_detail.listing_id.card_id.name if first_detail else "Varios",
            "image": first_detail.listing_id.card_id.image_url if first_detail else None,
            "seller": first_detail.listing_id.seller.username if first_detail else "Varios"
        })
    return JsonResponse(data, safe=False)


@csrf_exempt
@require_http_methods(["GET"])
def list_sales(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    # 1. Obtener Publicaciones Activas (Listings sin ventas aún o disponibles)
    active_listings = Listings.objects.filter(seller=request.user, status__in=["Available", "Disponible"]).select_related("card_id").order_by("-created_at")
    
    # 2. Obtener Negociaciones/Órdenes (Ventas en curso o completadas)
    orders = Orders.objects.filter(order_details__listing_id__seller=request.user).distinct().order_by("-created_at")

    data = []
    
    # Agregar listings disponibles
    for listing in active_listings:
        data.append({
            "id": f"listing_{listing.id}", # Prefijo para distinguir de órdenes
            "real_id": listing.id,
            "type": "listing",
            "total_price": float(listing.price),
            "status": "Available",
            "created_at": listing.created_at.isoformat(),
            "item_name": listing.card_id.name,
            "image": listing.card_id.image_url,
            "buyer": None
        })

    # Agregar órdenes
    for order in orders:
        first_detail = Order_details.objects.filter(order_id=order, listing_id__seller=request.user).select_related("listing_id__card_id").first()
        data.append({
            "id": order.id,
            "type": "order",
            "total_price": float(order.total_price),
            "status": order.status,
            "created_at": order.created_at.isoformat(),
            "item_name": first_detail.listing_id.card_id.name if first_detail else "Varios",
            "image": first_detail.listing_id.card_id.image_url if first_detail else None,
            "buyer": order.buyer_id.username
        })
    
    # Ordenar por fecha (las más recientes arriba)
    data.sort(key=lambda x: x["created_at"], reverse=True)
    return JsonResponse(data, safe=False)


@csrf_exempt
@require_http_methods(["GET"])
def get_order(request, order_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    try:
        order = Orders.objects.select_related('buyer_id').get(id=order_id)
        
        # Verificar si es comprador
        is_buyer = order.buyer_id == request.user
        
        # Verificar si es vendedor de algún item
        details = Order_details.objects.filter(order_id=order).select_related("listing_id__card_id", "listing_id__seller")
        is_seller = any(detail.listing_id.seller == request.user for detail in details)
        
        if not (is_buyer or is_seller):
             return JsonResponse({"error": "Order not found."}, status=404)
             
    except Orders.DoesNotExist:
        return JsonResponse({"error": "Order not found."}, status=404)

    details_data = []
    seller_names = set()
    for detail in details:
        listing = detail.listing_id
        card = listing.card_id
        seller_names.add(listing.seller.username)
        details_data.append({
            "id": detail.id,
            "listing": {
                "id": listing.id,
                "price": str(listing.price),
                "condition": listing.condition,
                "seller_username": listing.seller.username,
                "card": {
                    "id": card.id,
                    "name": card.name,
                    "image_url": card.image_url,
                },
            },
            "quantity": detail.quantity,
            "unit_price": str(detail.unit_price),
        })

    return JsonResponse({
        "id": order.id,
        "buyer_username": order.buyer_id.username,
        "seller_usernames": list(seller_names),
        "total_price": float(order.total_price),
        "status": order.status,
        "created_at": order.created_at.isoformat(),
        "details": details_data,
        "is_seller": is_seller
    })


# ─── Reviews Endpoints ──────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["POST"])
def create_review(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    required_fields = {"order_id", "rating"}
    if not required_fields.issubset(payload):
        return JsonResponse({"error": "Missing required fields: order_id, rating."}, status=400)

    rating = payload["rating"]
    if not isinstance(rating, int) or rating < 1 or rating > 5:
        return JsonResponse({"error": "Rating must be an integer between 1 and 5."}, status=400)

    try:
        order = Orders.objects.get(id=payload["order_id"], buyer_id=request.user)
    except Orders.DoesNotExist:
        return JsonResponse({"error": "Order not found or not owned by you."}, status=404)

    if Reviews.objects.filter(order_id=order).exists():
        return JsonResponse({"error": "Review already exists for this order."}, status=409)

    review = Reviews.objects.create(
        order_id=order,
        rating=rating,
        comment=payload.get("comment", ""),
    )

    return JsonResponse({
        "id": review.id,
        "order_id": order.id,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at.isoformat(),
    }, status=201)


@csrf_exempt
@require_http_methods(["GET"])
def get_review(request, order_id):
    try:
        review = Reviews.objects.select_related("order_id").get(order_id__id=order_id)
    except Reviews.DoesNotExist:
        return JsonResponse({"error": "Review not found for this order."}, status=404)

    return JsonResponse({
        "id": review.id,
        "order_id": review.order_id.id,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at.isoformat(),
    })

# ─── Chat Endpoints ───────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["POST"])
def add_order_message(request, order_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Autenticación requerida."}, status=401)
    
    try:
        payload = json.loads(request.body.decode("utf-8"))
        order = Orders.objects.get(id=order_id)
        message = Message.objects.create(
            order=order,
            sender=request.user,
            content=payload["content"]
        )
        return JsonResponse({
            "id": message.id,
            "sender": message.sender.username,
            "content": message.content,
            "created_at": message.created_at.isoformat()
        }, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def list_order_messages(request, order_id):
    messages = Message.objects.filter(order_id=order_id).order_by("created_at")
    return JsonResponse([
        {
            "id": m.id,
            "sender": m.sender.username,
            "content": m.content,
            "created_at": m.created_at.isoformat()
        }
        for m in messages
    ], safe=False)

@csrf_exempt
@require_http_methods(["GET"])
def list_user_listings(request, username):
    listings = Listings.objects.filter(seller__username=username, status__in=["Available", "Disponible"]).select_related("card_id").order_by("-created_at")
    data = [
        {
            "id": l.id,
            "card": {
                "name": l.card_id.name,
                "image_url": l.card_id.image_url,
                "rarity": l.card_id.rarity,
            },
            "price": float(l.price),
            "condition": l.condition
        }
        for l in listings
    ]
    return JsonResponse(data, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def add_item_to_order(request, order_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Auth required"}, status=401)
    
    try:
        payload = json.loads(request.body.decode("utf-8"))
        listing_id = payload.get("listing_id")
        quantity = int(payload.get("quantity", 1))
        
        order = Orders.objects.get(id=order_id)
        listing = Listings.objects.get(id=listing_id)
        
        # Verificar si ya está en la orden
        detail, created = Order_details.objects.get_or_create(
            order_id=order,
            listing_id=listing,
            defaults={"quantity": quantity, "unit_price": listing.price}
        )
        
        if not created:
            detail.quantity += quantity
            detail.save()
            
        # Recalcular total de la orden
        total = sum(d.quantity * d.unit_price for d in Order_details.objects.filter(order_id=order))
        order.total_price = total
        order.save()
        
        return JsonResponse({"message": "Item agregado a la negociación", "total": float(total)})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def remove_item_from_order(request, order_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Auth required"}, status=401)
    
    try:
        payload = json.loads(request.body.decode("utf-8"))
        detail_id = payload.get("detail_id")
        
        order = Orders.objects.get(id=order_id)
        
        # Validar que no quede vacía
        count = Order_details.objects.filter(order_id=order).count()
        if count <= 1:
            return JsonResponse({"error": "La negociación debe tener al menos una carta."}, status=400)
            
        Order_details.objects.filter(id=detail_id).delete()
        
        total = sum(d.quantity * d.unit_price for d in Order_details.objects.filter(order_id=order))
        order.total_price = total
        order.save()
        
        return JsonResponse({"message": "Item removido", "total": float(total)})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@require_http_methods(["PUT"])
def update_order_status(request, order_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Autenticación requerida."}, status=401)
    
    try:
        payload = json.loads(request.body.decode("utf-8"))
        order = Orders.objects.get(id=order_id)
        
        # Solo un vendedor de la orden puede cambiar el estado, 
        # excepto para cancelar que también puede el comprador.
        is_seller = Order_details.objects.filter(order_id=order, listing_id__seller=request.user).exists()
        is_buyer = order.buyer_id == request.user
        
        new_status = payload.get("status")
        
        if is_seller:
            # Vendedor puede hacer cualquier cosa
            pass
        elif is_buyer and new_status == "Cancelado":
            # Comprador solo puede cancelar
            pass
        else:
            return JsonResponse({"error": "No tienes permiso para realizar esta acción."}, status=403)
            
        order.status = new_status
        order.save()
        return JsonResponse({"id": order.id, "status": order.status})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def get_home_feed(request):
    # 1. Recommendations (Shuffle some available listings)
    all_available = list(Listings.objects.filter(status__in=["Available", "Disponible"]).select_related("card_id", "seller"))
    recommendations = random.sample(all_available, min(len(all_available), 8)) if all_available else []
    
    # 2. Latest Activity (Mix of new listings and new orders)
    recent_listings = Listings.objects.filter(status="Available").select_related("card_id", "seller").order_by("-created_at")[:5]
    recent_orders = Orders.objects.select_related("buyer_id").order_by("-created_at")[:5]
    
    activity = []
    for l in recent_listings:
        activity.append({
            "type": "listing",
            "user": l.seller.username,
            "card_name": l.card_id.name,
            "timestamp": l.created_at.isoformat(),
            "image": l.card_id.image_url
        })
    
    # Sort activity by timestamp
    activity.sort(key=lambda x: x["timestamp"], reverse=True)
    
    # 3. New Arrivals (Last 12 latest)
    new_arrivals = Listings.objects.filter(status__in=["Available", "Disponible"]).select_related("card_id", "seller").order_by("-created_at")[:12]

    return JsonResponse({
        "recommendations": [
            {
                "id": l.id,
                "price": str(l.price),
                "condition": l.condition,
                "seller": l.seller.username,
                "card": {
                    "name": l.card_id.name,
                    "image_url": l.card_id.image_url,
                    "collection": l.card_id.collection,
                    "rarity": l.card_id.rarity
                }
            } for l in recommendations
        ],
        "activity": activity,
        "new_arrivals": [
             {
                "id": l.id,
                "price": str(l.price),
                "condition": l.condition,
                "seller": l.seller.username,
                "card": {
                    "name": l.card_id.name,
                    "image_url": l.card_id.image_url,
                    "collection": l.card_id.collection
                }
            } for l in new_arrivals
        ]
    })