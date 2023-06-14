import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm'
import { Role } from './role.entity';

@Entity()
export class Permission{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        type:"varchar",
        length:255,
        comment:"权限名称"
    })
    name:string;

    @Column({
        type:"varchar",
        length:255,
        comment:"权限描述信息"
    })
    expression:string;

    @ManyToMany(type=>Role,role=>role.permissions)
    roles:Role[]

}