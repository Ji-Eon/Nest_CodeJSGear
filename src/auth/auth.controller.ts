import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request,Response } from 'express';
import { AuthService } from './auth.service';
import { Roles } from './decorator/role.decorator';
import { UserDTO } from './dto/user.dto';
import { RoleType } from './role-type';
import { RolesGuard } from './security/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/register')
    @UsePipes(ValidationPipe)
    async registerAccount(@Req() req: Request, @Body() UserDTO: UserDTO): Promise<any> {
        return await this.authService.registerUser(UserDTO);
    }

    @Post('/login')
    async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any>{
        const jwt = await this.authService.validateUser(userDTO)

        res.setHeader('Authorization', 'Bearer'+jwt.accessToken);
        return res.json(jwt);
    }

    @Get('/authenticate')
    @UseGuards(AuthGuard())
    isAuthenticated(@Req() req: Request): any{
        const user: any = req.user;
        return user;
    }
    @Get('/adminrole')
    @UseGuards(AuthGuard(), RolesGuard)
    @Roles(RoleType.ADMIN)
    adminRole(@Req() req: Request): any {
        const user: any = req.user;
        return user;
}

   
}
