import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Trade {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    sourceCurrency: string;

    @Column()
    targetCurrnecy: string;

    @Column()
    amount: number;

    @Column({ type: 'decimal', precision: 18, scale: 10, default: 0 })
    rate: number;

    @CreateDateColumn()
    createdAt: Date;
}
