import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  private mockUsers: Array<UserEntity> = [];

  findAll(): Promise<Array<UserEntity>> {
    return Promise.resolve(this.mockUsers);
  }

  async findOne(id: string): Promise<UserEntity | undefined> {
    return Promise.resolve(this.mockUsers.find((user) => user.id === id));
  }

  async update(id: string, data: Partial<UserEntity>): Promise<boolean> {
    const user = this.mockUsers.find((user) => user.id === id);
    console.log(`updating user ${id} with`, data); // TODO remove
    // update the user through the repository...
    return !!user;
  }
}
