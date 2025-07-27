import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth';
import { AppService } from './app.service';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AppService],
})
export class AppModule {}
