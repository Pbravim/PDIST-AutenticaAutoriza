import {
  IAuthentication,
  IAuthenticationRepository,
} from "../../Interfaces/authInterfaces";
import { models } from "../../../sequelize/models";
import AuthenticationModelSequelize from "../../../sequelize/models/authenticationModelSequelize";
import { IProfile } from "../../../_Autorização/Interfaces/profileInterfaces";
import { Transaction } from "sequelize";
import sequelize from "../../../../config/sequelize";
import ProfileModelSequelize from "../../../sequelize/models/profileModelSequelize";

class AuthenticationRepositorySequelize implements IAuthenticationRepository {
  async startTransaction(): Promise<Transaction> {
    return await sequelize.transaction(); // Inicia e retorna uma nova transação
  }

  /**
   * @inheritdoc
   */
  async findById(id: string): Promise<IAuthentication | null> {
    return await models.AuthenticationModelSequelize.findOne({
      where: { id: id },
      attributes: { exclude: ["passwordHash", "password_token_reset"] },
    });
  }

  async findByIdWithPassword(id: string): Promise<IAuthentication | null> {
    return await models.AuthenticationModelSequelize.findOne({
      where: { id: id },
    });
  }

  /**
   * @inheritdoc
   */
  async findByToken(token: string): Promise<IAuthentication | null> {
    return await models.AuthenticationModelSequelize.findOne({
      where: { password_token_reset: token },
      attributes: { exclude: ["passwordHash", "password_token_reset"] },
    });
  }

  /**
   * @inheritdoc
   */
  async findAll(): Promise<IAuthentication[]> {
    return await models.AuthenticationModelSequelize.findAll({
      attributes: { exclude: ["passwordHash", "password_token_reset"] },
    });
  }

  /**
   * @inheritdoc
   */
async findByLogin(
    login: string,
    options?: object
  ): Promise<IAuthentication | null> {
    return await models.AuthenticationModelSequelize.findOne({
      where: { login: login },
      attributes: { exclude: ["passwordHash", "password_token_reset"] },
      ...options,
    });
  }

  /**
   * @inheritdoc
   */
  async createAuthentication(
    auth: AuthenticationModelSequelize,
    options?: object
  ): Promise<IAuthentication> {
    const { passwordHash, password_token_reset, ...newAuth } =
      await models.AuthenticationModelSequelize.create(auth, options);

    return { ...newAuth.dataValues };
  }

  /**
   * @inheritdoc
   */
  async updateAuthentication(
    id: string,
    updateData: Partial<IAuthentication>
  ): Promise<IAuthentication> {
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== null)
    );

    const [affectedCount, updatedRows] =
      await models.AuthenticationModelSequelize.update(
        { ...filteredUpdateData, updatedAt: new Date() },
        { where: { id }, returning: true }
      );

    if (affectedCount === 0) {
      throw new Error("Authentication not found");
    }

    return updatedRows[0];
  }

  /**
   * @inheritdoc
   */
  async deleteAuthentication(id: string): Promise<void> {
    await models.AuthenticationModelSequelize.destroy({ where: { id: id } });
  }

  async getProfilesByAuthentication(
    auth: AuthenticationModelSequelize
  ): Promise<IProfile[]> {
    return await auth.getProfiles();
  }

  async addProfilesToAuthentication(
    profiles: ProfileModelSequelize[],
    auth: AuthenticationModelSequelize,
    options?: object
  ): Promise<void> {
    for (const profile of profiles) {
      await auth.addProfiles(profile);
    }
  }
}

export default AuthenticationRepositorySequelize;
