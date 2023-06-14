import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "./department.entity";
import { Role } from "./role.entity";

@Entity()
export class Employee{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        type:"varchar",
        length:255,
        comment:"用户名"
    })
    username:string;

    @Column({
        type:"varchar",
        length:255,
        comment:"昵称"
    })
    name:string;

    @Column({
        type:"varchar",
        length:255,
        comment:"密码"
    })
    password:string;

    @Column({
        type:"varchar",
        length:255,
        comment:"邮箱"
    })
    email:string;

    @Column({
        type:"int",
        comment:"年龄"
    })
    age:string;

    @Column({
        type:"tinyint",
        comment:"超级管理员"
    })
    admin:string;

    @ManyToOne(type=>Department,department=>department.employees,{
        cascade:true,
        eager:true
    })
    department:Department

    @ManyToMany(type=>Role,role=>role.employees,{
        cascade:true,eager:true
    })
    @JoinTable()
    roles:Role[];
}