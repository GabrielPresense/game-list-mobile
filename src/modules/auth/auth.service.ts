import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../../common/entities/user.entity';
import { RegisterDto, LoginDto } from '../../common/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; token: string }> {
    const { email, name, password } = registerDto;

    // Verificar se o usuário já existe
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Gerar token
    const token = this.jwtService.sign({ 
      sub: savedUser.id, 
      email: savedUser.email 
    });

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = savedUser;
    return { user: userWithoutPassword, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
    const { email, password } = loginDto;

    // Buscar usuário
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar token
    const token = this.jwtService.sign({ 
      sub: user.id, 
      email: user.email 
    });

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return user;
  }
}
