import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('No authorization header found');
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || token !== this.configService.get('ADMIN_PASSWORD')) {
            throw new UnauthorizedException('Invalid admin password');
        }

        return true;
    }
}
