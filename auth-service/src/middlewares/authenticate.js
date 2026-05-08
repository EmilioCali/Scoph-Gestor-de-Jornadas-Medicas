/**
 * Fastify preHandler — verifica el JWT del request.
 * Popula `request.user` con el payload del token si es válido.
 */
export async function authenticate(request, reply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    return reply.status(401).send({ ok: false, message: 'Token inválido o expirado' })
  }
}

/**
 * Verifica que el usuario autenticado tenga uno de los roles indicados.
 * @param {...string} roles - Roles permitidos
 * @returns {Function} Fastify preHandler
 */
export function requireRole(...roles) {
  return async function (request, reply) {
    await authenticate(request, reply)
    if (reply.sent) return
    if (!roles.includes(request.user.rol)) {
      return reply.status(403).send({ ok: false, message: 'Acceso denegado' })
    }
  }
}
