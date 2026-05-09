import bcrypt from 'bcryptjs'
import { User } from '../../models/user.model.js'

const SALT_ROUNDS = 12

/**
 * Autentica un usuario por username o correo.
 * @param {{ username?: string, correo?: string, password: string }} credentials
 * @returns {Promise<import('mongoose').Document>} Usuario autenticado
 */
export async function login({ username, correo, password }) {
  if (!username && !correo) {
    throw new Error('Debes proporcionar un username o correo')
  }

  const query = username ? { username: username.toLowerCase() } : { correo: correo.toLowerCase() }
  const user = await User.findOne(query)

  if (!user) {
    throw new Error('Credenciales inválidas')
  }

  if (!user.isActive) {
    throw new Error('Tu cuenta está desactivada. Contacta al administrador.')
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash)

  if (!isValidPassword) {
    throw new Error('Credenciales inválidas')
  }

  await User.findByIdAndUpdate(user._id, { ultimoAcceso: new Date() })

  return user
}

/**
 * Registra un nuevo usuario (solo puede hacerlo un ADMIN).
 * @param {Object} data - Datos del usuario a crear
 * @returns {Promise<import('mongoose').Document>} Usuario creado
 */
export async function register({ nombre, apellido, username, correo, password, rol, telefono, creadoPor }) {
  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { correo: correo.toLowerCase() }]
  })

  if (existingUser) {
    if (existingUser.username === username.toLowerCase()) {
      throw new Error('El username ya está en uso')
    }
    throw new Error('El correo ya está en uso')
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  const user = new User({
    nombre,
    apellido,
    username,
    correo,
    passwordHash,
    rol,
    telefono: telefono || null,
    creadoPor: creadoPor || null,
    mustChangePassword: true,
    emailVerificado: false
  })

  await user.save()
  return user
}

/**
 * Obtiene un usuario por su ID.
 * @param {string} id
 */
export async function getUserById(id) {
  const user = await User.findById(id)
  if (!user) throw new Error('Usuario no encontrado')
  return user
}

/**
 * Lista todos los usuarios (sin passwordHash).
 */
export async function listUsers() {
  return User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 })
}

/**
 * Activa o desactiva un usuario.
 * @param {string} id
 * @param {boolean} isActive
 */
export async function toggleUserStatus(id, isActive) {
  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true })
  if (!user) throw new Error('Usuario no encontrado')
  return user
}

/**
 * Cambia la contraseña del usuario autenticado.
 * @param {string} id
 * @param {string} currentPassword
 * @param {string} newPassword
 */
export async function changePassword(id, currentPassword, newPassword) {
  const user = await User.findById(id)
  if (!user) throw new Error('Usuario no encontrado')

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!isValid) throw new Error('La contraseña actual es incorrecta')

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)
  user.passwordHash = passwordHash
  user.mustChangePassword = false
  await user.save()

  return user
}
