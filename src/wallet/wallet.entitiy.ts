import { User } from 'src/users/users.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum Currency {
    NGN = 'NGN',
    USD = 'USD',
    EUR = 'EUR',
}

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user: User) => user.wallets, {
        onDelete: 'CASCADE',
    })
    user: User;

    @Column({ type: 'enum', enum: Currency })
    currency: string;

    @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
    balance: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
