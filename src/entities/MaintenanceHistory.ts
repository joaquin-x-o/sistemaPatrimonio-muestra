import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './Product';
import { User } from './User';

@Entity('maintenance_history')
export class MaintenanceHistory {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'repair_date', type: 'date' })
    repairDate!: Date;

    @Column({ name: 'unusable_date', type: 'date', nullable: true})
    unusableDate!: Date | null;

    @Column({ name: 'breakdown_reason', type: 'text'})
    breakdownReason!: string;

    @Column({ name: 'repair_description', type: 'text' })
    repairDescription!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    cost!: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // CONSTRUCTOR
    constructor(partial?: Partial<MaintenanceHistory>) {
        if (partial) Object.assign(this, partial);
    }

    // RELACIONES

    // MaintenanceHistory - Product
    @ManyToOne(() => Product, (product) => product.maintenanceHistory,{
    })
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    // MaintenanceHistory - User
    @ManyToOne(() => User)
    @JoinColumn({ name: 'operator_id' })
    operator!: User;

}