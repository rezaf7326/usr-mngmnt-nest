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
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class UserService {
  private logger: LoggerService;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly cryptoService: CryptoService,
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
    this.handleNotFound(user, { id });

    return user;
  }

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    this.logger.debug('find user by email', { email });
    const user = await this.userRepository.findOneBy({ email });
    this.handleNotFound(user, { email });

    return user;
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    this.logger.debug('creating new user...');
    try {
      const createdUser = await this.userRepository.save(
        this.userRepository.create({
          ...data,
          passwordHash: await this.cryptoService.hashPassword(data.password),
        }),
      );
      this.logger.verbose('user created', { createdUser });

      return createdUser;
    } catch (error) {
      // TODO enhance exception handling
      this.logger.error('duplication in create user', {
        email: data.email,
        error,
      });
      throw new BadRequestException('email already exists');
    }
  }

  async update(
    id: number,
    updateDto: UpdateUserDto,
  ): Promise<UserEntity | undefined> {
    this.logger.debug('update user', { id });
    const updatedUser = await this.userRepository.preload({
      id,
      ...updateDto,
    });
    this.handleNotFound(updatedUser, { id });
    await this.userRepository.save(updatedUser);
    this.logger.verbose('user is updated', updatedUser);

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

  private handleNotFound(user?: UserEntity, data?: Partial<UserEntity>) {
    if (!user) {
      this.logger.error('user not found', data);
      throw new NotFoundException('user not found');
    }
  }
}
