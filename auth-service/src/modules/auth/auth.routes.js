import { authenticate, requireRole } from '../../middlewares/authenticate.js'
import { login, register, getUserById, listUsers, toggleUserStatus, changePassword } from './auth.service.js'
import { loginSchema, registerSchema, changePasswordSchema, usuarioResponse } from './auth.schemas.js'

/**
 * Plugin de Fastify para el módulo de autenticación.
 * Prefix: /api/auth
 */
async function authPlugin(fastify) {
  /**
   * POST /api/auth/login
   * Autentica al usuario y retorna un JWT.
   */
  fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
    try {
      const { username, correo, password } = request.body
      const user = await login({ username, correo, password })

      const token = fastify.jwt.sign(
        { id: user._id, rol: user.rol, username: user.username },
        { expiresIn: '8h' }
      )

      return reply.send({
        ok: true,
        token,
        user: user.toSafeJSON(),
        mustChangePassword: user.mustChangePassword
      })
    } catch (err) {
      return reply.status(401).send({ ok: false, message: err.message })
    }
  })

  /**
   * GET /api/auth/me
   * Retorna el usuario autenticado actual.
   */
  fastify.get(
    '/me',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Autenticación'],
        summary: 'Mi perfil',
        description: 'Retorna la información del usuario actualmente autenticado.',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              ok: { type: 'boolean' },
              user: usuarioResponse
            }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const user = await getUserById(request.user?.id || null)
        return reply.send({ ok: true, user: user.toSafeJSON() })
      } catch (err) {
        return reply.status(404).send({ ok: false, message: err.message })
      }
    }
  )

  /**
   * POST /api/auth/register
   * Crea un nuevo usuario. Solo ADMIN.
   */
  fastify.post(
    '/register',
    { schema: registerSchema},
    async (request, reply) => {
      try {
        const user = await register({ ...request.body, creadoPor: request.user?.id || null})
        return reply.status(201).send({ ok: true, user: user.toSafeJSON() })
      } catch (err) {
        return reply.status(400).send({ ok: false, message: err.message })
      }
    }
  )

  /**
   * GET /api/auth/users
   * Lista todos los usuarios. Solo ADMIN.
   */
  fastify.get(
    '/users',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Usuarios'],
        summary: 'Listar usuarios',
        description: 'Retorna la lista completa de usuarios registrados. Solo ADMIN.',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              ok: { type: 'boolean' },
              users: { type: 'array', items: usuarioResponse, description: 'Lista de usuarios' }
            }
          }
        }
      }
    },
    async (request, reply) => {
      const users = await listUsers()
      return reply.send({ ok: true, users: users.map((u) => u.toSafeJSON()) })
    }
  )

  /**
   * PATCH /api/auth/users/:id/status
   * Activa o desactiva un usuario. Solo ADMIN.
   */
  fastify.patch(
    '/users/:id/status',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Usuarios'],
        summary: 'Cambiar estado de usuario',
        description: 'Activa o desactiva una cuenta de usuario. Solo ADMIN.',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID del usuario (usr_...)' }
          }
        },
        body: {
          type: 'object',
          required: ['isActive'],
          properties: {
            isActive: { type: 'boolean', description: 'true para activar, false para desactivar' }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const { isActive } = request.body
        if (typeof isActive !== 'boolean') {
          return reply.status(400).send({ ok: false, message: 'isActive debe ser booleano' })
        }
        const user = await toggleUserStatus(request.params.id, isActive)
        return reply.send({ ok: true, user: user.toSafeJSON() })
      } catch (err) {
        return reply.status(404).send({ ok: false, message: err.message })
      }
    }
  )

  /**
   * POST /api/auth/change-password
   * Cambia la contraseña del usuario autenticado.
   */
  fastify.post(
    '/change-password',
    { schema: changePasswordSchema, preHandler: [authenticate] },
    async (request, reply) => {
      try {
        const { currentPassword, newPassword } = request.body
        await changePassword(request.user.id, currentPassword, newPassword)
        return reply.send({ ok: true, message: 'Contraseña actualizada correctamente' })
      } catch (err) {
        return reply.status(400).send({ ok: false, message: err.message })
      }
    }
  )
}

export default authPlugin
