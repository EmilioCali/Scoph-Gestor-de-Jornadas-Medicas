  export const usuarioResponse = {
    type: 'object',
    properties: {
      _id: { type: 'string', example: 'usr_a1b2c3d4e5f6' },
      nombre: { type: 'string', example: 'Daniel' },
      apellido: { type: 'string', example: 'Gómez' },
      username: { type: 'string', example: 'dgomez' },
      correo: { type: 'string', example: 'daniel@gmail.com' },
      rol: { type: 'string', enum: ['ADMIN', 'MEDICO', 'ENFERMERO', 'ASISTENTE'] },
      telefono: { type: 'string', example: '12345678' },
      fotoPerfil: { type: 'string', nullable: true },
      isActive: { type: 'boolean' },
      mustChangePassword: { type: 'boolean' },
      emailVerificado: { type: 'boolean' },
      ultimoAcceso: { type: 'string', format: 'date-time', nullable: true },
      creadoPor: { type: 'string', nullable: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  }

  const errorResponse = {
    type: 'object',
    properties: {
      ok: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Descripción del error' }
    }
  }

  export const loginSchema = {
    tags: ['Autenticación'],
    summary: 'Iniciar sesión',
    description: 'Autentica al usuario con su username o correo y retorna un token JWT.',
    body: {
      type: 'object',
      required: ['password'],
      properties: {
        username: { type: 'string', example: 'dgomez', description: 'Username del usuario' },
        correo: { type: 'string', example: 'daniel@gmail.com', description: 'Correo del usuario' },
        password: { type: 'string', minLength: 1, example: 'miContraseña123' }
      },
      description: 'Se requiere password y al menos uno de: username o correo'
    },
    response: {
      200: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: true },
          token: { type: 'string', description: 'Token JWT válido por 8 horas' },
          mustChangePassword: { type: 'boolean', description: 'Si es true, el usuario debe cambiar su contraseña' },
          user: usuarioResponse
        }
      },
      401: errorResponse
    }
  }

  export const registerSchema = {
    tags: ['Usuarios'],
    summary: 'Crear usuario',
    description: 'Crea un nuevo usuario en el sistema. Solo puede hacerlo un usuario con rol ADMIN.',
    security: [{ bearerAuth: [] }],
    body: {
      type: 'object',
      required: ['nombre', 'apellido', 'username', 'correo', 'password', 'rol'],
      properties: {
        nombre: { type: 'string', minLength: 1, example: 'Daniel' },
        apellido: { type: 'string', minLength: 1, example: 'Gómez' },
        username: { type: 'string', minLength: 3, example: 'dgomez' },
        correo: { type: 'string', example: 'daniel@gmail.com' },
        password: { type: 'string', minLength: 8, example: 'ContraseñaSegura123' },
        rol: { type: 'string', enum: ['ADMIN', 'MEDICO', 'ENFERMERO', 'ASISTENTE'] },
        telefono: { type: 'string', example: '12345678' }
      }
    },
    response: {
      201: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: true },
          user: usuarioResponse
        }
      },
      400: errorResponse,
      403: errorResponse
    }
  }

  export const changePasswordSchema = {
    tags: ['Autenticación'],
    summary: 'Cambiar contraseña',
    description: 'Permite al usuario autenticado cambiar su propia contraseña.',
    security: [{ bearerAuth: [] }],
    body: {
      type: 'object',
      required: ['currentPassword', 'newPassword'],
      properties: {
        currentPassword: { type: 'string', minLength: 1, example: 'contraseñaActual' },
        newPassword: { type: 'string', minLength: 8, example: 'nuevaContraseña123' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Contraseña actualizada correctamente' }
        }
      },
      400: errorResponse
    }
  }
