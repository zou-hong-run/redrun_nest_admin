import { Column, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PhotoMeta } from "./photo.meta.entity";
import { Author } from "./author.entity";
import { Album } from "./album.entity";

@Entity()
export class Photo{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        length:100
    })
    name:string;

    @Column("text")
    description:string;

    @Column()
    filename:string;

    @Column("double")
    views:number;

    @Column("bit")
    isPublished:boolean;
    /**
     * 关系可以是单向的或双向的。
     * 目前 PhotoMetadata 和 Photo 之间的关系是单向的。
     * 关系的所有者是 PhotoMetadata，
     * 而 Photo 对 PhotoMetadata 一无所知。
     * 这使得从 Photo 中访问 PhotoMetadata 变得很复杂。
     * 要解决这个问题，我们应该在 PhotoMetadata 和 Photo 之间建立双向关系。
     * 让我们来修改一下实体：
     */
    @OneToOne(type=>PhotoMeta,photometa=>photometa.photo,{
        // 保存其他对象的同事保存相关对象
        /**
         * 使用cascade允许 就不需要边存 photo 边存元数据对象。
         * 我们可以简单地保存一个 photo 对象，
         * 由于使用了 cascade，metadata 也将自动保存。
         */
        cascade:true,
        eager:true,// 自动加载关联数据
    })
    metadata:PhotoMeta

    // 关系的所有者方添加到Photo实体中
    /**
     * 在多对一/一对多的关系中，拥有方总是多对一的。
     * 这意味着使用@ManyToOne的类将存储相关对象的 id。
     * 运行应用程序后，ORM 将创建author表：
     * 它还将修改photo表，添加新的author列并为其创建外键：
     */
    @ManyToOne(type=>Author,author=>author.photos)
    author:Author

    // 现在添加反向关系到Photo类：
    @ManyToMany(type=>Album,album=>album.photos)
    albums:Album[];

}