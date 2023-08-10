import {
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  private users: Array<UserEntity> = [];
  private logger: LoggerService;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  findAll(): Promise<Array<UserEntity>> {
    this.logger.debug('find all users');
    return Promise.resolve(this.users);
  }

  async findOne(id: number): Promise<UserEntity | undefined> {
    this.logger.debug('find user', { id });
    const user = this.users.find((user) => user.id === id);
    !user && this.throwNotFoundError({ id });

    return user;
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    this.logger.debug('creating new user...');
    const createdUser: UserEntity = {
      id: this.users.length + 1,
      ...data,
    } as UserEntity;
    // validate data if necessary
    this.users.push(createdUser);
    this.logger.verbose('user is created', {
      ...this.userLogData(createdUser),
    });

    return createdUser;
  }

  async update(
    id: number,
    data: Partial<UserEntity>,
  ): Promise<UserEntity | undefined> {
    this.logger.debug('update user', { id, ...this.userLogData(data) });
    let user = this.users.find((user) => user.id === id);
    delete data.id; // to prevent id modification
    !user && this.throwNotFoundError({ id, ...data });
    user = {
      ...user,
      ...data,
    };
    this.users.splice(
      this.users.findIndex((user) => user.id === id),
      1,
      user,
    );
    this.logger.verbose('user is updated', { ...this.userLogData(user) });

    return user;
  }

  async remove(id: number): Promise<UserEntity | undefined> {
    this.logger.debug('delete user', { id });
    const user = this.users.find((user) => user.id === id);
    !user && this.throwNotFoundError({ id });
    this.users = this.users.filter((user) => user.id !== id);
    this.logger.verbose('user is deleted', { id });

    return user;
  }

  private throwNotFoundError(user: Partial<UserEntity>) {
    this.logger.error('user not found', {
      ...this.userLogData(user),
    });
    throw new NotFoundException(`no user was found with id ${user.id}`);
  }

  private userLogData(data: Partial<UserEntity>): Partial<UserEntity> {
    return {
      ...data,
      password: data.password ? '*'.repeat(data.password.length) : '-',
    };
  }
}
