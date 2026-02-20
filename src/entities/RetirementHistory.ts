import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn, CreateDateColumn} from 'typeorm';
import { Product } from './Product';
import { User } from './User';

@Entity('retirement_history')
export class RetirementHistory{
    // ATRIBUTOS
    @PrimaryGeneratedColumn({name: 'retirement_history_id'})
    id!: number;

    @Column({ name: 'document_reference', type: 'varchar'})
    documentReference!: string | null;

    @Column({name:'retirement_reason', type: 'text'})
    retirementReason!: string;

    @Column({name:'transaction_date', default: () => 'CURRENT_DATE'})
    transactionDate!: Date;

    @CreateDateColumn({ name: 'created_at' })
        createdAt!: Date;
    
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // CONSTRUCTOR 
    constructor(partial?: Partial<RetirementHistory>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }

    // RELACIONES

    // RetirementHistory -- Product:  Cada registro de baja corresponde a un único producto.
    @ManyToOne(() => Product, (product) => product.retirementHistory)
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    // RetirementHistory -- User: Cada registro de baja fue realizado por un único usuario.
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

}