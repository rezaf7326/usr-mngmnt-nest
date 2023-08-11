import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../decorators/public.decorator';
import { AuthenticatedUser } from '../decorators/authenticated-user.decorator';
import { AuthenticateDto } from '../auth/dto/authenticate.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(
    @Param('id') id: number,
    @AuthenticatedUser() authenticatedUser: AuthenticateDto,
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

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateDto: UpdateUserDto,
    @AuthenticatedUser() authenticatedUser: AuthenticateDto,
  ) {
    this.authorization(id, authenticatedUser);
    return this.userService.update(id, updateDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @AuthenticatedUser() authenticatedUser: AuthenticateDto,
  ) {
    this.authorization(id, authenticatedUser);
    return this.userService.remove(id);
  }

  private authorization(id: number, authenticatedUser: AuthenticateDto) {
    if (authenticatedUser.id !== id) {
      throw new ForbiddenException();
    }
  }
}
