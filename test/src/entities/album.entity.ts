import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "./photo.entity";

@Entity()
export class Album{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;


    @ManyToMany(type=>Photo,photo=>photo.albums)
    // @JoinTable需要指定这是关系的所有者方。
    @JoinTable()
    photos:Photo[];
}