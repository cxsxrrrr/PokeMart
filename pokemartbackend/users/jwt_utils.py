"""
JWT utility functions for PokéMart authentication.

Uses PyJWT to generate and validate access/refresh tokens.
Access tokens are short-lived (30 min), refresh tokens long-lived (7 days).
"""

import jwt
import datetime
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

# ── Token lifetimes ──────────────────────────────────────────────────────────
ACCESS_TOKEN_LIFETIME = datetime.timedelta(minutes=30)
REFRESH_TOKEN_LIFETIME = datetime.timedelta(days=7)

# We reuse Django's SECRET_KEY as the HMAC signing key.
_SECRET = settings.SECRET_KEY
_ALGORITHM = "HS256"


def generate_tokens(user):
    """Return a (access_token, refresh_token) pair for the given user."""
    now = datetime.datetime.now(datetime.timezone.utc)

    access_payload = {
        "user_id": user.id,
        "username": user.username,
        "type": "access",
        "iat": now,
        "exp": now + ACCESS_TOKEN_LIFETIME,
    }

    refresh_payload = {
        "user_id": user.id,
        "type": "refresh",
        "iat": now,
        "exp": now + REFRESH_TOKEN_LIFETIME,
    }

    access_token = jwt.encode(access_payload, _SECRET, algorithm=_ALGORITHM)
    refresh_token = jwt.encode(refresh_payload, _SECRET, algorithm=_ALGORITHM)

    return access_token, refresh_token


def decode_token(token, expected_type="access"):
    """
    Decode and validate a JWT token.

    Returns the payload dict on success.
    Raises ValueError with a user-friendly message on failure.
    """
    try:
        payload = jwt.decode(token, _SECRET, algorithms=[_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise ValueError("Token expirado.")
    except jwt.InvalidTokenError:
        raise ValueError("Token inválido.")

    if payload.get("type") != expected_type:
        raise ValueError("Tipo de token incorrecto.")

    return payload


def get_user_from_token(token, expected_type="access"):
    """
    Validate an access (or refresh) token and return the User instance.

    Raises ValueError if the token is invalid or the user doesn't exist.
    """
    payload = decode_token(token, expected_type=expected_type)
    user_id = payload.get("user_id")

    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise ValueError("Usuario no encontrado.")


def get_user_from_request(request):
    """
    Try to authenticate the request via JWT first, then fall back to session.

    Returns the authenticated User or None.
    """
    # 1. Try JWT from Authorization header
    auth_header = request.META.get("HTTP_AUTHORIZATION", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
        try:
            return get_user_from_token(token, expected_type="access")
        except ValueError:
            return None

    # 2. Fall back to Django session auth
    if request.user.is_authenticated:
        return request.user

    return None
