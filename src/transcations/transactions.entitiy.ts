import { User } from '../users/users.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transcations {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user: User) => user.id)
    user: User;

    @Column({ type: 'decimal', precision: 18, scale: 2 })
    amount: number;

    @Column()
    currency: string;

    @Column()
    type: 'debit' | 'credit';

    @Column({ default: 'pending' })
    status: 'pending' | 'success' | 'failed';

    @CreateDateColumn()
    createdAt: Date;
}
