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
import { Express } from 'express';
import { ProfileEntity } from './entities/profile.entity';

@Injectable()
export class UserService {
  private logger: LoggerService;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
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
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
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
    if (await this.emailExists(data.email)) {
      this.logger.error('create user email existed', { email: data.email });
      throw new BadRequestException('email already exists');
    }
    const createdUser = await this.userRepository.save(
      this.userRepository.create({
        ...data,
        passwordHash: await this.cryptoService.hashPassword(data.password),
        profile: this.profileRepository.create({ image: null, mimeType: '' }),
      }),
    );
    this.logger.verbose('user created', { createdUser });

    return createdUser;
  }

  async updateImage(id: number, file: Express.Multer.File) {
    this.logger.debug('update user image', { id });
    const user = await this.findOne(id);
    user.profile.image = file.buffer;
    user.profile.mimeType = file.mimetype;
    await this.userRepository.save(user);
  }

  async removeImage(id: number) {
    this.logger.debug('remove user image', { id });
    const user = await this.findOne(id);
    user.profile.image = null;
    user.profile.mimeType = '';
    await this.userRepository.save(user);
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

  async emailExists(email: string): Promise<boolean> {
    let alreadyExists = false;
    try {
      alreadyExists = !!(await this.findOneByEmail(email));
    } catch (e) {
      /* skip not found error */
    }

    return alreadyExists;
  }

  private handleNotFound(user?: UserEntity, data?: Partial<UserEntity>) {
    if (!user) {
      this.logger.error('user not found', data);
      throw new NotFoundException('user not found');
    }
  }
}
