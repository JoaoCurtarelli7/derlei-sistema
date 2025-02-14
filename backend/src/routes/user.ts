import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { hash, compare } from 'bcryptjs'

export async function userRoutes(app: FastifyInstance) {
  // Editar dados do perfil do usuário
  app.put('/user/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { name, email, phone, address } = request.body as {
      name: string
      email: string
      phone: string
      address: string
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { name, email, phone, address },
      })

      return reply.send(updatedUser)
    } catch (error) {
      return reply.status(400).send({ message: 'Erro ao atualizar usuário', error })
    }
  })

  // Alterar senha do usuário
  app.patch('/user/:id/password', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { currentPassword, newPassword } = request.body as {
      currentPassword: string
      newPassword: string
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      })

      if (!user) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }

      const passwordMatch = await compare(currentPassword, user.password)

      if (!passwordMatch) {
        return reply.status(401).send({ message: 'Senha atual incorreta' })
      }

      const hashedNewPassword = await hash(newPassword, 10)

      await prisma.user.update({
        where: { id: parseInt(id) },
        data: { password: hashedNewPassword },
      })

      return reply.send({ message: 'Senha alterada com sucesso' })
    } catch (error) {
      return reply.status(400).send({ message: 'Erro ao alterar senha', error })
    }
  })
}
