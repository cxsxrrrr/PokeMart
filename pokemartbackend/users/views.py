import json

from django.http import JsonResponse
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

User = get_user_model()


@csrf_exempt
@require_http_methods(["POST"])
def create_user(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    required_fields = {"username", "email", "password"}

    if not required_fields.issubset(payload):
        return JsonResponse({"error": "Missing required fields."}, status=400)

    if User.objects.filter(username=payload["username"]).exists():
        return JsonResponse({"error": "Username already exists."}, status=409)

    if User.objects.filter(email=payload["email"]).exists():
        return JsonResponse({"error": "Email already exists."}, status=409)

    user = User.objects.create_user(
        username=payload["username"],
        email=payload["email"],
        password=payload["password"],
        avatar_url=payload.get("avatarUrl", ""),
        is_active=False  # User must verify email first
    )

    # Generate 6-digit OTP
    import random
    from django.core.cache import cache
    otp_code = f"{random.randint(100000, 999999)}"
    
    # Store in cache: key = "verify_{email}", timeout = 600s (10 min)
    cache.set(f"verify_{user.email}", otp_code, timeout=600)

    # Send verification email via Resend
    try:
        import resend
        from django.conf import settings
        resend.api_key = settings.RESEND_API_KEY
        resend.Emails.send({
            "from": "PokéMart <noreply@poke-mart.store>",
            "to": [user.email],
            "subject": "Verifica tu correo electrónico - PokéMart",
            "html": f"""
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
                    <h1 style="color: #5b21b6; font-size: 24px; margin-bottom: 8px;">PokéMart TCG</h1>
                    <p style="color: #475569; font-size: 15px;">Hola <strong>{user.username}</strong>, gracias por registrarte. Para activar tu cuenta, por favor verifica tu correo.</p>
                    <div style="background: linear-gradient(135deg, #7c3aed, #06b6d4); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                        <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 0 0 8px 0; letter-spacing: 2px; text-transform: uppercase;">Tu código de verificación</p>
                        <p style="color: #fff; font-size: 36px; font-weight: 800; letter-spacing: 8px; margin: 0;">{otp_code}</p>
                    </div>
                    <p style="color: #94a3b8; font-size: 13px;">Este código expira en <strong>10 minutos</strong>.</p>
                </div>
            """,
        })
    except Exception as e:
        print(f"Error sending verification email: {e}")
        pass  # Don't block registration if email fails

    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "avatarUrl": user.avatar_url,
    }, status=201)


@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    required_fields = {"username", "password"}

    if not required_fields.issubset(payload):
        return JsonResponse({"error": "Missing required fields."}, status=400)

    user = authenticate(
        request,
        username=payload["username"],
        password=payload["password"]
    )

    if user is None:
        # Check if user exists but hasn't verified their email
        try:
            unverified = User.objects.get(username=payload["username"])
            if not unverified.is_active:
                return JsonResponse(
                    {"error": "Debes verificar tu correo electrónico antes de iniciar sesión.",
                     "needsVerification": True,
                     "email": unverified.email},
                    status=403
                )
        except User.DoesNotExist:
            pass
        return JsonResponse({"error": "Invalid credentials."}, status=401)

    login(request, user)
    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "avatarUrl": user.avatar_url,
    }, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def logout_user(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully."}, status=200)


@csrf_exempt
@require_http_methods(["GET"])
def get_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)
    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "avatarUrl": user.avatar_url,
    }, status=200)


@csrf_exempt
@require_http_methods(["GET"])
def get_current_user(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    user = request.user
    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "avatarUrl": user.avatar_url,
    }, status=200)


# ────────────────────────────────────────────
#  Forgot / Reset password  (OTP via Resend)
# ────────────────────────────────────────────
import random
import resend
from django.core.cache import cache
from django.conf import settings


@csrf_exempt
@require_http_methods(["POST"])
def forgot_password(request):
    """Generate a 6-digit OTP, store it in cache, and send via Resend."""
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    email = payload.get("email", "").strip().lower()
    if not email:
        return JsonResponse({"error": "El campo email es requerido."}, status=400)

    # Check user exists
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "No existe una cuenta registrada con ese correo."}, status=404)

    # Generate 6-digit OTP
    otp_code = f"{random.randint(100000, 999999)}"

    # Store in cache: key = "otp_{email}", timeout = 600s (10 min)
    cache.set(f"otp_{email}", otp_code, timeout=600)

    # Send email via Resend
    resend.api_key = settings.RESEND_API_KEY

    try:
        resend.Emails.send({
            "from": "PokéMart <noreply@poke-mart.store>",
            "to": [email],
            "subject": "Tu código de recuperación - PokéMart",
            "html": f"""
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
                    <h1 style="color: #5b21b6; font-size: 24px; margin-bottom: 8px;">PokéMart TCG</h1>
                    <p style="color: #475569; font-size: 15px;">Hola <strong>{user.username}</strong>, recibimos una solicitud para restablecer tu contraseña.</p>
                    <div style="background: linear-gradient(135deg, #7c3aed, #06b6d4); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                        <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 0 0 8px 0; letter-spacing: 2px; text-transform: uppercase;">Tu código OTP</p>
                        <p style="color: #fff; font-size: 36px; font-weight: 800; letter-spacing: 8px; margin: 0;">{otp_code}</p>
                    </div>
                    <p style="color: #94a3b8; font-size: 13px;">Este código expira en <strong>10 minutos</strong>. Si no solicitaste esto, ignora este correo.</p>
                </div>
            """,
        })
    except Exception as e:
        return JsonResponse({"error": f"Error al enviar el correo: {str(e)}"}, status=500)

    return JsonResponse({"message": "Si el correo existe, se envió el código OTP."}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def reset_password(request):
    """Verify OTP and set a new password."""
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    email = payload.get("email", "").strip().lower()
    otp = payload.get("otp", "").strip()
    new_password = payload.get("newPassword", "")

    if not all([email, otp, new_password]):
        return JsonResponse({"error": "Todos los campos son requeridos."}, status=400)

    if len(new_password) < 6:
        return JsonResponse({"error": "La contraseña debe tener al menos 6 caracteres."}, status=400)

    # Verify OTP
    cached_otp = cache.get(f"otp_{email}")
    if cached_otp is None:
        return JsonResponse({"error": "El código OTP ha expirado. Solicita uno nuevo."}, status=400)

    if cached_otp != otp:
        return JsonResponse({"error": "El código OTP es incorrecto."}, status=400)

    # Update password
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "Usuario no encontrado."}, status=404)

    user.set_password(new_password)
    user.save()

    # Invalidate OTP
    cache.delete(f"otp_{email}")

    return JsonResponse({"message": "Contraseña actualizada exitosamente."}, status=200)

@csrf_exempt
@require_http_methods(["POST"])
def verify_email(request):
    """Verify OTP and activate the user, then send welcome email."""
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    email = payload.get("email", "").strip().lower()
    otp = payload.get("otp", "").strip()

    if not all([email, otp]):
        return JsonResponse({"error": "El correo y el código son requeridos."}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "Usuario no encontrado."}, status=404)
        
    if user.is_active:
        return JsonResponse({"error": "Esta cuenta ya está verificada."}, status=400)

    # Verify OTP
    cached_otp = cache.get(f"verify_{email}")
    if cached_otp is None:
        return JsonResponse({"error": "El código ha expirado. Por favor, solicita uno nuevo."}, status=400)

    if cached_otp != otp:
        return JsonResponse({"error": "El código es incorrecto."}, status=400)

    # Activate user
    user.is_active = True
    user.save()

    # Invalidate OTP
    cache.delete(f"verify_{email}")

    # Send welcome email via Resend
    try:
        resend.api_key = settings.RESEND_API_KEY
        resend.Emails.send({
            "from": "PokéMart <noreply@poke-mart.store>",
            "to": [user.email],
            "subject": "¡Bienvenido a PokéMart TCG! 🎉",
            "html": f"""
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 0;">
                    <div style="background: linear-gradient(135deg, #5b21b6, #7c3aed, #06b6d4); padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
                        <h1 style="color: #fff; font-size: 28px; margin: 0 0 8px 0; font-weight: 800;">¡Bienvenido, {user.username}! 🎉</h1>
                        <p style="color: rgba(255,255,255,0.85); font-size: 15px; margin: 0;">Tu aventura de colección comienza ahora</p>
                    </div>
                    <div style="background: #ffffff; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                        <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                            Tu cuenta ha sido verificada exitosamente. Ya puedes explorar nuestra tienda, descubrir cartas épicas y empezar tu colección.
                        </p>
                        <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                            <p style="color: #64748b; font-size: 13px; margin: 0 0 4px 0;">Tu nombre de usuario</p>
                            <p style="color: #1e1b4b; font-size: 18px; font-weight: 700; margin: 0;">{user.username}</p>
                        </div>
                        <a href="https://poke-mart.store/login" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #06b6d4); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px;">
                            Iniciar Sesión →
                        </a>
                        <p style="color: #94a3b8; font-size: 12px; margin: 24px 0 0 0;">
                            © 2026 PokéMart International. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            """,
        })
    except Exception as e:
        print(f"Error sending welcome email: {e}")
        pass

    # Log the user in automatically after verifying
    login(request, user, backend='django.contrib.auth.backends.ModelBackend')

    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "avatarUrl": user.avatar_url,
        "message": "Correo verificado exitosamente."
    }, status=200)