import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './Product';
import { Department } from './Department';
import { User } from './User';

@Entity('movement_history')
export class MovementHistory {
    //ATRIBUTOS

    @PrimaryGeneratedColumn({ name: 'movement_id' })
    id!: number;

    @Column({ name: 'movement_date', type: 'date', default: () => 'CURRENT_DATE' })
    transferDate!: Date;

    @Column({ name: 'reason_movement', type: 'text' })
    reasonForMovement!: string; // Ej: "Traslado por cambio de oficina"

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // CONSTRUCTOR
    constructor(partial?: Partial<MovementHistory>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }

    // RELACIONES

    // MovementHistory -- Product: Cada registro de traslado corresponde a un único producto.
    @ManyToOne(() => Product, (product) => product.movementHistory)
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    // MovementHistory -- Department (Origen): Cada traslado tiene un único departamento de origen (desde dónde salió).
    @ManyToOne(() => Department, (department) => department.movementsOrigin)
    @JoinColumn({ name: 'origin_department_id' })
    originDepartment!: Department;

    // MovementHistory -- Department (Destino): Cada traslado tiene un único departamento de destino (hacia dónde fue).
    @ManyToOne(() => Department, (department) => department.movementsDestination)
    @JoinColumn({ name: 'destination_department_id' })
    destinationDepartment!: Department;

    // MovementHistory -- User: Cada traslado fue registrado/autorizado por un único usuario.
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}