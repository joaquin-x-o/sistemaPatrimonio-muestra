import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from "../enums/user.enums";


@Entity('user')
export class User {
    // ATRIBUTOS
    @PrimaryGeneratedColumn({ name: 'user_id' })
    id!: number;

    @Column()
    name!: string;

    @Column()
    surname!: string;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;
    
    @Column({default: true})
    isActive!: boolean;
    
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.VIEWER
    })
    role!: UserRole;


    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // CONSTRUCTOR
    constructor(partial?: Partial<User>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }

}