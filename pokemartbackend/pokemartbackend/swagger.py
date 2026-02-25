import json
from django.http import JsonResponse, HttpResponse


OPENAPI_SPEC = {
    "openapi": "3.0.3",
    "info": {
        "title": "PokeMart API",
        "description": "Backend API for the PokeMart trading card marketplace.",
        "version": "1.0.0",
    },
    "servers": [
        {"url": "http://localhost:8000", "description": "Development server"}
    ],
    "tags": [
        {"name": "Users", "description": "User registration, authentication and profile"},
        {"name": "Cards", "description": "Pokemon card catalog"},
        {"name": "Listings", "description": "Card listings for sale"},
        {"name": "Cart", "description": "Shopping cart operations"},
        {"name": "Orders", "description": "Order management"},
        {"name": "Reviews", "description": "Order reviews"},
    ],
    "paths": {
        # ── Users ────────────────────────────────────────────────────────
        "/users/create/": {
            "post": {
                "tags": ["Users"],
                "summary": "Register a new user",
                "operationId": "createUser",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": ["username", "email", "password"],
                                "properties": {
                                    "username": {"type": "string", "example": "ash_ketchum"},
                                    "email": {"type": "string", "format": "email", "example": "ash@pokemon.com"},
                                    "password": {"type": "string", "format": "password", "example": "pikachu123"},
                                },
                            }
                        }
                    },
                },
                "responses": {
                    "201": {
                        "description": "User created successfully",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/UserResponse"}}},
                    },
                    "400": {
                        "description": "Invalid payload or missing required fields",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}},
                    },
                    "409": {
                        "description": "Username or email already exists",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}},
                    },
                },
            }
        },
        "/users/login/": {
            "post": {
                "tags": ["Users"],
                "summary": "Authenticate user and start session",
                "operationId": "loginUser",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": ["username", "password"],
                                "properties": {
                                    "username": {"type": "string", "example": "ash_ketchum"},
                                    "password": {"type": "string", "format": "password", "example": "pikachu123"},
                                },
                            }
                        }
                    },
                },
                "responses": {
                    "200": {
                        "description": "Login successful",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/UserResponse"}}},
                    },
                    "400": {
                        "description": "Invalid payload or missing required fields",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}},
                    },
                    "401": {
                        "description": "Invalid credentials",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}},
                    },
                },
            }
        },
        "/users/logout/": {
            "post": {
                "tags": ["Users"],
                "summary": "End the current user session",
                "operationId": "logoutUser",
                "responses": {
                    "200": {
                        "description": "Logout successful",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {"type": "string", "example": "Logged out successfully."}
                                    },
                                }
                            }
                        },
                    }
                },
            }
        },
        "/users/me/": {
            "get": {
                "tags": ["Users"],
                "summary": "Get the currently authenticated user",
                "operationId": "getCurrentUser",
                "responses": {
                    "200": {
                        "description": "Current user data",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/UserResponse"}}},
                    },
                    "401": {
                        "description": "Authentication required",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}},
                    },
                },
            }
        },
        "/users/{user_id}/": {
            "get": {
                "tags": ["Users"],
                "summary": "Get user by ID",
                "operationId": "getUser",
                "parameters": [
                    {
                        "name": "user_id",
                        "in": "path",
                        "required": True,
                        "schema": {"type": "integer"},
                        "description": "User ID",
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User found",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/UserResponse"}}},
                    },
                    "404": {
                        "description": "User not found",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}},
                    },
                },
            }
        },
        # ── Store / Health ───────────────────────────────────────────────
        "/store/health/": {
            "get": {
                "tags": ["Cards"],
                "summary": "Health check",
                "operationId": "healthCheck",
                "responses": {
                    "200": {
                        "description": "Service is running",
                        "content": {"text/plain": {"schema": {"type": "string", "example": "OK"}}},
                    }
                },
            }
        },
        # ── Cards ────────────────────────────────────────────────────────
        "/store/cards/": {
            "get": {
                "tags": ["Cards"],
                "summary": "List a random sample of cards (up to 30)",
                "operationId": "listLimitedCards",
                "responses": {
                    "200": {
                        "description": "List of cards",
                        "content": {
                            "application/json": {
                                "schema": {"type": "array", "items": {"$ref": "#/components/schemas/Card"}}
                            }
                        },
                    }
                },
            }
        },
        "/store/cards/search/": {
            "get": {
                "tags": ["Cards"],
                "summary": "Search cards by name",
                "operationId": "searchCards",
                "parameters": [
                    {
                        "name": "q",
                        "in": "query",
                        "required": True,
                        "schema": {"type": "string"},
                        "description": "Search query for card name",
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Matching cards",
                        "content": {
                            "application/json": {
                                "schema": {"type": "array", "items": {"$ref": "#/components/schemas/Card"}}
                            }
                        },
                    },
                    "400": {
                        "description": "Missing query parameter",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}},
                    },
                },
            }
        },
        "/store/cards/{card_id}/": {
            "get": {
                "tags": ["Cards"],
                "summary": "Get card details by ID",
                "operationId": "getCard",
                "parameters": [
                    {
                        "name": "card_id",
                        "in": "path",
                        "required": True,
                        "schema": {"type": "integer"},
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Card details",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Card"}}},
                    },
                    "404": {
                        "description": "Card not found",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}},
                    },
                },
            }
        },
        # ── Listings ─────────────────────────────────────────────────────
        "/store/listings/": {
            "get": {
                "tags": ["Listings"],
                "summary": "List all available listings",
                "operationId": "listListings",
                "responses": {
                    "200": {
                        "description": "List of listings",
                        "content": {
                            "application/json": {
                                "schema": {"type": "array", "items": {"$ref": "#/components/schemas/Listing"}}
                            }
                        },
                    }
                },
            }
        },
        "/store/listings/create/": {
            "post": {
                "tags": ["Listings"],
                "summary": "Create a new listing (requires auth)",
                "operationId": "createListing",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": ["card_id", "price", "quantity", "condition"],
                                "properties": {
                                    "card_id": {"type": "integer", "example": 1},
                                    "price": {"type": "number", "example": 25.50},
                                    "quantity": {"type": "integer", "example": 3},
                                    "condition": {"type": "string", "enum": ["Graded 10", "Graded 9", "Graded 8", "Near Mint", "Lightly Played", "Played", "Heavily Played", "Damaged"], "example": "Near Mint"},
                                    "description": {"type": "string", "example": "Excellent card, no scratches"},
                                },
                            }
                        }
                    },
                },
                "responses": {
                    "201": {
                        "description": "Listing created",
                        "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ListingResponse"}}},
                    },
                    "400": {"description": "Missing fields", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                    "401": {"description": "Authentication required", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                    "404": {"description": "Card not found", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                },
            }
        },
        "/store/listings/{listing_id}/": {
            "get": {
                "tags": ["Listings"],
                "summary": "Get listing details",
                "operationId": "getListing",
                "parameters": [{"name": "listing_id", "in": "path", "required": True, "schema": {"type": "integer"}}],
                "responses": {
                    "200": {"description": "Listing details", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Listing"}}}},
                    "404": {"description": "Listing not found", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                },
            }
        },
        "/store/listings/{listing_id}/update/": {
            "put": {
                "tags": ["Listings"],
                "summary": "Update a listing (owner only)",
                "operationId": "updateListing",
                "parameters": [{"name": "listing_id", "in": "path", "required": True, "schema": {"type": "integer"}}],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "price": {"type": "number"},
                                    "quantity": {"type": "integer"},
                                    "condition": {"type": "string"},
                                    "status": {"type": "string"},
                                    "description": {"type": "string"},
                                },
                            }
                        }
                    },
                },
                "responses": {
                    "200": {"description": "Listing updated", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ListingResponse"}}}},
                    "401": {"description": "Authentication required", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                    "404": {"description": "Not found or not owned", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                },
            }
        },
        "/store/listings/{listing_id}/delete/": {
            "delete": {
                "tags": ["Listings"],
                "summary": "Delete a listing (owner only)",
                "operationId": "deleteListing",
                "parameters": [{"name": "listing_id", "in": "path", "required": True, "schema": {"type": "integer"}}],
                "responses": {
                    "200": {"description": "Listing deleted", "content": {"application/json": {"schema": {"type": "object", "properties": {"message": {"type": "string"}}}}}},
                    "401": {"description": "Authentication required", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                    "404": {"description": "Not found or not owned", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                },
            }
        },
        # ── Cart ─────────────────────────────────────────────────────────
        "/store/cart/": {
            "get": {
                "tags": ["Cart"],
                "summary": "List cart items for the authenticated user",
                "operationId": "listCartItems",
                "responses": {
                    "200": {"description": "Cart items", "content": {"application/json": {"schema": {"type": "array", "items": {"$ref": "#/components/schemas/CartItem"}}}}},
                    "401": {"description": "Authentication required", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                },
            }
        },
        "/store/cart/add/": {
            "post": {
                "tags": ["Cart"],
                "summary": "Add an item to the cart",
                "operationId": "addCartItem",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": ["listing_id", "quantity"],
                                "properties": {
                                    "listing_id": {"type": "integer", "example": 1},
                                    "quantity": {"type": "integer", "example": 1},
                                },
                            }
                        }
                    },
                },
                "responses": {
                    "201": {"description": "Item added to cart", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CartItemResponse"}}}},
                    "200": {"description": "Existing item quantity updated", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CartItemResponse"}}}},
                    "400": {"description": "Missing fields or listing unavailable", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                    "401": {"description": "Authentication required", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                    "404": {"description": "Listing not found", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                },
            }
        },
        "/store/cart/{cart_item_id}/update/": {
            "put": {
                "tags": ["Cart"],
                "summary": "Update cart item quantity",
                "operationId": "updateCartItem",
                "parameters": [{"name": "cart_item_id", "in": "path", "required": True, "schema": {"type": "integer"}}],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": ["quantity"],
                                "properties": {
                                    "quantity": {"type": "integer", "example": 2},
                                },
                            }
                        }
                    },
                },
                "responses": {
                    "200": {"description": "Cart item updated", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CartItemResponse"}}}},
                    "401": {"description": "Authentication required", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                    "404": {"description": "Cart item not found", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                },
            }
        },
        "/store/cart/{cart_item_id}/delete/": {
            "delete": {
                "tags": ["Cart"],
                "summary": "Remove an item from the cart",
                "operationId": "deleteCartItem",
                "parameters": [{"name": "cart_item_id", "in": "path", "required": True, "schema": {"type": "integer"}}],
                "responses": {
                    "200": {"description": "Cart item removed", "content": {"application/json": {"schema": {"type": "object", "properties": {"message": {"type": "string"}}}}}},
                    "401": {"description": "Authentication required", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                    "404": {"description": "Cart item not found", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                },
            }
        },
        # ── Orders ───────────────────────────────────────────────────────
        "/store/orders/": {
            "get": {
                "tags": ["Orders"],
                "summary": "List orders for the authenticated user",
                "operationId": "listOrders",
                "responses": {
                    "200": {"description": "List of orders", "content": {"application/json": {"schema": {"type": "array", "items": {"$ref": "#/components/schemas/OrderSummary"}}}}},
                    "401": {"description": "Authentication required", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                },
            }
        },
        "/store/orders/create/": {
            "post": {
                "tags": ["Orders"],
                "summary": "Create an order from the cart (requires auth)",
                "operationId": "createOrder",
                "responses": {
                    "201": {"description": "Order created and cart cleared", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/OrderSummary"}}}},
                    "400": {"description": "Cart is empty", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                    "401": {"description": "Authentication required", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                },
            }
        },
        "/store/orders/{order_id}/": {
            "get": {
                "tags": ["Orders"],
                "summary": "Get order details with line items",
                "operationId": "getOrder",
                "parameters": [{"name": "order_id", "in": "path", "required": True, "schema": {"type": "integer"}}],
                "responses": {
                    "200": {"description": "Order details", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/OrderDetail"}}}},
                    "401": {"description": "Authentication required", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                    "404": {"description": "Order not found", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                },
            }
        },
        # ── Reviews ──────────────────────────────────────────────────────
        "/store/reviews/create/": {
            "post": {
                "tags": ["Reviews"],
                "summary": "Create a review for an order (requires auth)",
                "operationId": "createReview",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": ["order_id", "rating"],
                                "properties": {
                                    "order_id": {"type": "integer", "example": 1},
                                    "rating": {"type": "integer", "minimum": 1, "maximum": 5, "example": 5},
                                    "comment": {"type": "string", "example": "Great seller, fast shipping!"},
                                },
                            }
                        }
                    },
                },
                "responses": {
                    "201": {"description": "Review created", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Review"}}}},
                    "400": {"description": "Invalid rating or missing fields", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                    "401": {"description": "Authentication required", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                    "404": {"description": "Order not found", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                    "409": {"description": "Review already exists for this order", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                },
            }
        },
        "/store/reviews/{order_id}/": {
            "get": {
                "tags": ["Reviews"],
                "summary": "Get the review for a specific order",
                "operationId": "getReview",
                "parameters": [{"name": "order_id", "in": "path", "required": True, "schema": {"type": "integer"}}],
                "responses": {
                    "200": {"description": "Review found", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Review"}}}},
                    "404": {"description": "Review not found", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Error"}}}},
                },
            }
        },
    },
    "components": {
        "schemas": {
            "UserResponse": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer", "example": 1},
                    "username": {"type": "string", "example": "ash_ketchum"},
                    "email": {"type": "string", "format": "email", "example": "ash@pokemon.com"},
                    "role": {"type": "string", "enum": ["customer", "seller", "admin"], "example": "customer"},
                },
            },
            "Card": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer", "example": 1},
                    "name": {"type": "string", "example": "Charizard"},
                    "collection": {"type": "string", "example": "Base Set"},
                    "rarity": {"type": "string", "example": "Rare Holo"},
                    "image_url": {"type": "string", "format": "uri", "example": "https://images.pokemontcg.io/base1/4.png"},
                    "recommended_price": {"type": "string", "example": "120.00"},
                },
            },
            "Listing": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "seller": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "username": {"type": "string"},
                        },
                    },
                    "card": {"$ref": "#/components/schemas/Card"},
                    "price": {"type": "string", "example": "25.50"},
                    "quantity": {"type": "integer", "example": 3},
                    "condition": {"type": "string", "example": "Near Mint"},
                    "status": {"type": "string", "example": "Available"},
                    "description": {"type": "string"},
                    "created_at": {"type": "string", "format": "date-time"},
                },
            },
            "ListingResponse": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "seller_id": {"type": "integer"},
                    "card_id": {"type": "integer"},
                    "price": {"type": "string"},
                    "quantity": {"type": "integer"},
                    "condition": {"type": "string"},
                    "status": {"type": "string"},
                    "description": {"type": "string"},
                    "created_at": {"type": "string", "format": "date-time"},
                },
            },
            "CartItem": {
                "type": "object",
                "properties": {
                    "cart_item_id": {"type": "integer"},
                    "quantity": {"type": "integer"},
                    "added_at": {"type": "string", "format": "date-time"},
                    "listing": {
                        "type": "object",
                        "properties": {
                            "listing_id": {"type": "integer"},
                            "price": {"type": "string"},
                            "condition": {"type": "string"},
                            "status": {"type": "string"},
                            "description": {"type": "string"},
                            "card": {"$ref": "#/components/schemas/Card"},
                        },
                    },
                },
            },
            "CartItemResponse": {
                "type": "object",
                "properties": {
                    "cart_item_id": {"type": "integer"},
                    "listing_id": {"type": "integer"},
                    "quantity": {"type": "integer"},
                    "added_at": {"type": "string", "format": "date-time"},
                },
            },
            "OrderSummary": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "total_price": {"type": "string", "example": "75.00"},
                    "status": {"type": "string", "example": "Pending"},
                    "created_at": {"type": "string", "format": "date-time"},
                },
            },
            "OrderDetail": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "buyer_id": {"type": "integer"},
                    "total_price": {"type": "string"},
                    "status": {"type": "string"},
                    "created_at": {"type": "string", "format": "date-time"},
                    "details": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "integer"},
                                "listing": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "integer"},
                                        "price": {"type": "string"},
                                        "condition": {"type": "string"},
                                        "card": {
                                            "type": "object",
                                            "properties": {
                                                "id": {"type": "integer"},
                                                "name": {"type": "string"},
                                                "image_url": {"type": "string"},
                                            },
                                        },
                                    },
                                },
                                "quantity": {"type": "integer"},
                                "unit_price": {"type": "string"},
                            },
                        },
                    },
                },
            },
            "Review": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "order_id": {"type": "integer"},
                    "rating": {"type": "integer", "minimum": 1, "maximum": 5},
                    "comment": {"type": "string"},
                    "created_at": {"type": "string", "format": "date-time"},
                },
            },
            "Error": {
                "type": "object",
                "properties": {
                    "error": {"type": "string", "example": "Error description."}
                },
            },
        }
    },
}


def openapi_schema(request):
    return JsonResponse(OPENAPI_SPEC, safe=False)


def swagger_ui(request):
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PokeMart API Documentation</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
        SwaggerUIBundle({
            url: '/docs/schema/',
            dom_id: '#swagger-ui',
            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset
            ],
            layout: 'BaseLayout',
            deepLinking: true,
        });
    </script>
</body>
</html>"""
    return HttpResponse(html, content_type="text/html")
