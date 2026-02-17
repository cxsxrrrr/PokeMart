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
        {"name": "Store", "description": "Cards, cart and general store operations"},
    ],
    "paths": {
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
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/UserResponse"}
                            }
                        },
                    },
                    "400": {
                        "description": "Invalid payload or missing required fields",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/Error"}
                            }
                        },
                    },
                    "409": {
                        "description": "Username or email already exists",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/Error"}
                            }
                        },
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
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/UserResponse"}
                            }
                        },
                    },
                    "400": {
                        "description": "Invalid payload or missing required fields",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/Error"}
                            }
                        },
                    },
                    "401": {
                        "description": "Invalid credentials",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/Error"}
                            }
                        },
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
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/UserResponse"}
                            }
                        },
                    },
                    "404": {
                        "description": "User not found",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/Error"}
                            }
                        },
                    },
                },
            }
        },
        "/store/health/": {
            "get": {
                "tags": ["Store"],
                "summary": "Health check",
                "operationId": "healthCheck",
                "responses": {
                    "200": {
                        "description": "Service is running",
                        "content": {
                            "text/plain": {
                                "schema": {"type": "string", "example": "OK"}
                            }
                        },
                    }
                },
            }
        },
        "/store/cards/": {
            "get": {
                "tags": ["Store"],
                "summary": "List a random sample of cards",
                "description": "Returns up to 30 cards selected from a random offset in the database.",
                "operationId": "listLimitedCards",
                "responses": {
                    "200": {
                        "description": "List of cards",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {"$ref": "#/components/schemas/Card"},
                                }
                            }
                        },
                    }
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
