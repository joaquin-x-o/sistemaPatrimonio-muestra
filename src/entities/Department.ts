import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './Product';
import { MovementHistory } from './MovementHistory';

@Entity('department')
export class Department {
    // ATRIBUTOS
    @PrimaryGeneratedColumn({ name: 'department_id' })
    id!: number;

    @Column({ name: 'department_code', unique: true })
    departmentCode!: string;

    @Column()
    name!: string;

    @Column({ name: 'responsible_name' })
    responsibleName!: string;

    @Column({ name: 'is_active', default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // CONSTRUCTOR

    constructor(partial?: Partial<Department>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }

    // RELACIONES

    // Department - Product: Un departamento puede estar a cargo de uno o más productos 
    @OneToMany(() => Product, (product) => product.department)
    products!: Product[]

    // Department - MovementHistory (Origen): Un departamento puede ser el punto de partida de múltiples traslados (productos que salieron de esta área).
    @OneToMany(() => MovementHistory, (history) => history.originDepartment)
    movementsOrigin!: MovementHistory[];

    // Department - MovementHistory (Destino): Un departamento puede ser el punto de llegada de múltiples traslados (productos que entraron a esta área).
    @OneToMany(() => MovementHistory, (history) => history.destinationDepartment)
    movementsDestination!: MovementHistory[];

}