import { User } from 'src/users/users.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user: User) => user.wallets, {
        onDelete: 'CASCADE',
    })
    user: User;

    @Column()
    currency: 'NGN' | 'USD' | 'EUR';

    @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
    balance: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
