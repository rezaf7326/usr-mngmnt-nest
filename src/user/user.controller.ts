import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../decorators/public.decorator';
import { AuthenticatedUser } from '../decorators/authenticated-user.decorator';
import { AuthenticatedDto } from '../auth/dto/authenticated.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(
    @Param('id') id: number,
    @AuthenticatedUser() authenticatedUser: AuthenticatedDto,
  ) {
    this.authorization(id, authenticatedUser);
    return this.userService.findOne(id);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto);
  }

  @Post(':id/img')
  @UseInterceptors(FileInterceptor('profile'))
  @HttpCode(HttpStatus.CREATED)
  updateProfile(
    @Param('id') id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5_000_000 }), // five megabytes max
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @AuthenticatedUser() authenticatedUser: AuthenticatedDto,
  ) {
    this.authorization(id, authenticatedUser);
    return this.userService.updateImage(id, image);
  }

  @Delete(':id/img')
  removeProfile(
    @Param('id') id: number,
    @AuthenticatedUser() authenticatedUser: AuthenticatedDto,
  ) {
    this.authorization(id, authenticatedUser);
    return this.userService.removeImage(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateDto: UpdateUserDto,
    @AuthenticatedUser() authenticatedUser: AuthenticatedDto,
  ) {
    this.authorization(id, authenticatedUser);
    return this.userService.update(id, updateDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @AuthenticatedUser() authenticatedUser: AuthenticatedDto,
  ) {
    this.authorization(id, authenticatedUser);
    return this.userService.remove(id);
  }

  private authorization(id: number, authenticatedUser: AuthenticatedDto) {
    if (authenticatedUser.id !== id) {
      throw new ForbiddenException();
    }
  }
}
