import {
  BadRequestException,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private logger: LoggerService;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  findAll(): Promise<Array<UserEntity>> {
    this.logger.debug('find all users');
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity | undefined> {
    this.logger.debug('find user', { id });
    const user = await this.userRepository.findOneBy({ id });
    !user && this.throwNotFoundError({ id });

    return user;
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    this.logger.debug('creating new user...');
    try {
      const createdUser = await this.userRepository.save(
        this.userRepository.create({ ...data }),
      );
      this.logger.verbose('user is created', {
        ...this.userLogData(createdUser),
      });

      return createdUser;
    } catch (error) {
      this.logger.error('duplication in create user', {
        userData: { ...this.userLogData(data) },
        error,
      });
      throw new BadRequestException('email already exists'); // TODO enhance
    }
  }

  async update(
    id: number,
    updateDto: UpdateUserDto,
  ): Promise<UserEntity | undefined> {
    this.logger.debug('update user', { id, ...this.userLogData(updateDto) });
    const updatedUser = await this.userRepository.preload({
      id,
      ...updateDto,
    });
    !updatedUser && this.throwNotFoundError({ id, ...updateDto });
    await this.userRepository.save(updatedUser);
    this.logger.verbose('user is updated', {
      ...this.userLogData(updatedUser),
    });

    return updatedUser;
  }

  async remove(id: number): Promise<UserEntity | undefined> {
    this.logger.debug('delete user', { id });
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.userRepository.remove(user);
      this.logger.verbose('user is deleted', { id });
    }

    return user;
  }

  private throwNotFoundError(user: Partial<UserEntity>) {
    this.logger.error('user not found', {
      ...this.userLogData(user),
    });
    throw new NotFoundException(`no user was found with id ${user.id}`);
  }

  private userLogData(data: UserEntity | UpdateUserDto | CreateUserDto) {
    return {
      ...data,
      ...(data.password ? { password: '*'.repeat(data.password.length) } : {}),
    };
  }
}
