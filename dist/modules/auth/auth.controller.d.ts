import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '../../common/dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: Partial<import("../../common/entities/user.entity").User>;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Partial<import("../../common/entities/user.entity").User>;
        token: string;
    }>;
    getProfile(req: any): Promise<any>;
}
