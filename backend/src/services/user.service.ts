import { prisma } from "../utils/prisma.js";
import { UpdateUserRoleInput, UpdateUserStatusInput, Role } from "@tavo/shared";

export class UserService {
  async getAllUsers() {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
    });
    
    return users.map(u => ({
      ...u,
      roles: u.roles as Role[],
      createdAt: u.createdAt.toISOString(),
      lastLogin: u.lastLogin.toISOString(),
    }));
  }

  async updateUserRole(id: string, data: UpdateUserRoleInput) {
    if (!data.roles.includes("admin")) {
      // Prevent removing last admin
      const adminCount = await prisma.user.count({
        where: {
          roles: { has: "admin" },
          isActive: true,
          id: { not: id },
        }
      });
      
      if (adminCount === 0) {
        throw { status: 400, message: "Cannot remove the last active admin" };
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: { roles: data.roles },
    });

    return {
      ...user,
      roles: user.roles as Role[],
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLogin.toISOString(),
    };
  }

  async updateUserStatus(id: string, data: UpdateUserStatusInput) {
    if (!data.isActive) {
      // Prevent deactivating last admin
      const user = await prisma.user.findUnique({ where: { id } });
      if (user?.roles.includes("admin")) {
        const adminCount = await prisma.user.count({
          where: {
            roles: { has: "admin" },
            isActive: true,
            id: { not: id },
          }
        });
        
        if (adminCount === 0) {
          throw { status: 400, message: "Cannot deactivate the last active admin" };
        }
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: data.isActive },
    });

    return {
      ...updated,
      roles: updated.roles as Role[],
      createdAt: updated.createdAt.toISOString(),
      lastLogin: updated.lastLogin.toISOString(),
    };
  }
}
