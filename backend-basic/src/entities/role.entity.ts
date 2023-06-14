import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm'
import { Employee } from './employee.entity';
import { Permission } from './permisson.entity';

@Entity()
export class Role{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        type:"varchar",
        length:255,
        comment:"角色名称"
    })
    name:string;

    @Column({
        type:"varchar",
        length:255,
        comment:"角色描述信息"
    })
    sn:string;

    @ManyToMany(type=>Employee,employee=>employee.roles)
    employees:Employee[]

    @ManyToMany(type=>Permission,permission=>permission.roles,{
        cascade:true
    })
    @JoinTable()
    permissions:Permission[]

}