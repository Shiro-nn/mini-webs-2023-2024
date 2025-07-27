import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from '../app.service';

@Controller("auth")
export class AuthController {
    constructor(private readonly appService: AppService) {}

    @Post("login")
    login(@Req() request: Request): string {
        return this.appService.getHello();
    }

    @Post("register")
    register(@Req() request: Request): string {
        return this.appService.getHello();
    }
}
