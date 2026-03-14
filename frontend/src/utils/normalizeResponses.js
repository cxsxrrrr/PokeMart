/**
 * Utilidad para normalizar las respuestas de backend y traducirlas al español.
 */

const ERROR_MESSAGES = {
  // Auth
  "Invalid credentials.": "Credenciales inválidas. Por favor, verifica tu nombre de usuario y contraseña.",
  "Username already exists.": "Este nombre de usuario ya está registrado. Por favor, elige otro.",
  "Email already exists.": "Este correo electrónico ya está en uso por otra cuenta.",
  "Missing required fields.": "Por favor, completa todos los campos obligatorios.",
  "Invalid JSON payload.": "Los datos enviados no son válidos.",
  "User not found.": "Usuario no encontrado.",
  "Authentication required.": "Es necesario iniciar sesión para realizar esta acción.",
  "Logged out successfully.": "Sesión cerrada correctamente.",
  
  // Store & Cart
  "Card not found.": "Carta no encontrada.",
  "Listing not found.": "El anuncio ya no está disponible.",
  "Listing not found or not owned by you.": "Anuncio no encontrado o no tienes permisos para editarlo.",
  "Listing is not available.": "Este artículo ya ha sido vendido o no está disponible.",
  "Cart item not found.": "No se encontró el artículo en el carrito.",
  "Cart is empty.": "Tu carrito de compras está vacío.",
  "Order not found.": "No se pudo encontrar el pedido.",
  "Order not found or not owned by you.": "Pedido no encontrado o no pertenece a tu cuenta.",
  "Review already exists for this order.": "Ya has dejado una reseña para este pedido.",
  "Rating must be an integer between 1 and 5.": "La calificación debe ser un número entre 1 y 5.",
  "Query parameter 'q' is required.": "Es necesario escribir algo en el buscador.",
  "Missing required fields: card_id, price, quantity, condition.": "Faltan datos obligatorios para crear el anuncio.",
  "Missing required fields: listing_id, quantity.": "Faltan datos para añadir al carrito.",
  "Missing required field: quantity.": "Debes especificar la cantidad.",
  "Missing required fields: order_id, rating.": "Faltan datos para enviar la reseña.",
  
  // Genericas
  "Network Error": "Error de conexión. Por favor, verifica tu internet.",
  "Failed to fetch": "No se pudo conectar con el servidor. Asegúrate de que el backend esté activo.",
  "Load failed": "No se pudo cargar la información. Verifica tu conexión.",
  "Server Error": "Hubo un error en el servidor. Inténtalo más tarde.",
  "Error al iniciar sesión": "No se pudo iniciar sesión. Verifica tus datos.",
  "Error al crear la cuenta": "Hubo un problema al crear tu cuenta. Inténtalo de nuevo.",
  "No autenticado": "Tu sesión ha expirado o no has iniciado sesión."
};

/**
 * Normaliza un error de objeto o cadena en un mensaje legible en español.
 * @param {any} error - El error del backend o un objeto Error.
 * @returns {string} - El mensaje normalizado en español.
 */
export const normalizeError = (error) => {
  if (!error) return "Ocurrió un error inesperado.";

  // Si es una cadena, busca directamente
  if (typeof error === 'string') {
    return ERROR_MESSAGES[error] || error;
  }

  // Si tiene una propiedad 'error' (común en nuestro backend)
  if (error.error && typeof error.error === 'string') {
    return ERROR_MESSAGES[error.error] || error.error;
  }

  // Si es una instancia de Error
  if (error.message) {
    return ERROR_MESSAGES[error.message] || error.message;
  }

  return "Ocurrió un error inesperado al procesar la solicitud.";
};

export default normalizeError;
