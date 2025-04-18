import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Wallet } from '../wallet/wallet.entitiy';
import { Transcations } from '../transcations/transactions.entitiy';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ type: 'text', nullable: true })
    emailOtp: string | null;

    @Column({ type: 'timestamptz', nullable: true })
    expireOtp: Date | null;

    @Column({ default: false })
    isActive: boolean;

    @OneToMany(() => Wallet, (wallet: Wallet) => wallet.user)
    wallets: Wallet[];

    @OneToMany(
        () => Transcations,
        (transactions: Transcations) => transactions.user,
    )
    transactions: Transcations[];

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;
}
