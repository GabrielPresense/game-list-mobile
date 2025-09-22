import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../common/entities/user.entity';
import { RegisterDto, LoginDto } from '../../common/dto/auth.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: Partial<User>;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Partial<User>;
        token: string;
    }>;
    validateUser(userId: number): Promise<User>;
}
