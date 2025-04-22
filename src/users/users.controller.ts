import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@Controller('v1/users')
@ApiTags()
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get(':id')
    @ApiOperation({ summary: 'Get a single user by ID' })
    @ApiResponse({ status: 200, description: 'Returns user Data' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT')
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async findOne(@Param('id') id: string) {
        const user = await this.userService.findOne(id);
        return user;
    }

    @Get()
    async findAll() {
        const users = await this.userService.findAll();
        return users;
    }
}
