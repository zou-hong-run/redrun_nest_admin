import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "./photo.entity";

@Entity()
export class Author{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    // Author包含反向关系，！！OneToMany总是反向的！！，并且总是与ManyToOne一起出现
    /**
     * 在多对一/一对多的关系中，拥有方总是多对一的。
     * 这意味着使用@ManyToOne的类将存储相关对象的 id。
     * 运行应用程序后，ORM 将创建author表：
     * 它还将修改photo表，添加新的author列并为其创建外键：
     */
    @OneToMany(type=>Photo,photo=>photo.author)
    photos:Photo[]
}