import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { Employee } from './employee.entity';

@Entity()
export class Department{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        type:"varchar",
        length:255,
        comment:"部门名称"
    })
    name:string;

    @Column({
        type:"varchar",
        length:255,
        comment:"部门描述信息"
    })
    sn:string;

    @OneToMany(type=>Employee,employee=>employee.department)
    employees:Employee[]

}