import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { ProductCategory, ProductCondition } from '../enums/product.enums';
import { Department } from './Department';
import { User } from './User';
import { RetirementHistory } from './RetirementHistory';
import { MovementHistory } from './MovementHistory';
import { MaintenanceHistory } from './MaintenanceHistory';

@Entity('product')
export class Product {


  // ATRIBUTOS

  @PrimaryGeneratedColumn({ name: 'product_id' })
  id!: number;

  @Column({ name: 'product_code', unique: true })
  productCode!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({nullable: true})
  observation!: string;

  // indica si el producto fue registrado antes o despues de la implementación del sistema
  @Column({name:'is_msm', default: false})
  isLegacy!: boolean;

  @Column({ type: 'enum', enum: ProductCategory, default: ProductCategory.OTHER })
  category!: ProductCategory;

  @Column({ type: 'enum', enum: ProductCondition, default: ProductCondition.NEW })
  physicalCondition!: ProductCondition;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ name: 'is_pending_review', type: 'boolean', default: false })
  isPendingReview!: boolean;

  @Column({ name: 'pending_review_reason', type: 'text', nullable: true, })
  pendingReviewReason!: string | null;

  @Column({ name: 'last_check_date', type: 'date', nullable: true, })
  lastCheckDate!: Date | null;

  // fecha dado de alta burocráticamente
  @Column({ name: 'registration_date', type: 'date', nullable: true })
  registrationDate!: Date | null;

  @Column({ default: false })
  isRetired!: boolean;

  @Column({ name: 'retirement_date', type: 'date', nullable: true, })
  retirementDate!: Date | null;

  @Column({ name: 'date_unusable', type: 'date', nullable: true })
  dateUnusable!: Date | null;

  @Column({ name: 'unusable_reason', type: 'text', nullable: true })
  unusableReason!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // CONSTRUCTOR

  constructor(partial?: Partial<Product>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }


  // RELACIONES

  // Product - Department: Uno o mas productos pueden encontrarse en un solo departamento
  @ManyToOne(() => Department, (department) => department.products)
  @JoinColumn({ name: 'department_id' })
  department!: Department;

  // Product - User: Uno o mas productos son registrados por un solo usuario
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // Product - RetirementHistory: un solo producto puede tener mas de una entrada en el historial de bajas
  @OneToMany(() => RetirementHistory, (history) => history.product)
  retirementHistory!: RetirementHistory[];

  // Product - MovementHistory: un solo producto puede trasladarse a varios departamentos mas de una vez
  @OneToMany(() => MovementHistory, (history) => history.product)
  movementHistory!: MovementHistory[];

  // Product - MaintenanceHistory: un producto puede ser reparado mas de una vez
  @OneToMany(() => MaintenanceHistory, (history) => history.product)
  maintenanceHistory!: MaintenanceHistory[];

}
