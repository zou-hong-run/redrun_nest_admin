import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "./photo.entity";

@Entity()
export class PhotoMeta{
    @PrimaryGeneratedColumn()
    id:number;

    @Column("int")
    height:number;

    @Column("int")
    width:number

    @Column()
    orientation:string;

    @Column()
    compressed:boolean;

    @Column()
    comment:string;

    /**
     * 这里我们使用了一个名为@OneToOne的新装饰器,
     * 它允许我们在两个实体之间创建一对一的关系。
     * type => Photo是一个函数，返回我们想要与之建立关系的实体的类。
     * 由于特定于语言的关系，我们只能使用一个返回类的函数，
     * 而不是直接使用该类。
     * 同时也可以把它写成()=> Photo，
     * 但是type => Photo显得代码更有可读性。
     * type 变量本身不包含任何内容。
     */
    /**
     * 我们还添加了一个@JoinColumn装饰器，表明实体键的对应关系。
     * 关系可以是单向的或双向的。
     * 但是只有一方是拥有者。在关系的所有者方面需要使用@JoinColumn 装饰器。
     */
    /**
     * 如果运行该应用程序，你将看到一个新生成的表，它将包含一个带有关系外键的列：
    */
    /**
     * 关系可以是单向的或双向的。
     * 目前 PhotoMetadata 和 Photo 之间的关系是单向的。
     * 关系的所有者是 PhotoMetadata，
     * 而 Photo 对 PhotoMetadata 一无所知。
     * 这使得从 Photo 中访问 PhotoMetadata 变得很复杂。
     * 要解决这个问题，我们应该在 PhotoMetadata 和 Photo 之间建立双向关系。
     * 让我们来修改一下实体：
     *  @OneToOne(type=>Photo)
        @JoinColumn()
        photo:Photo;
     */
    @OneToOne(type=>Photo,photo=>photo.metadata)
    // 使用这个会增加一条外键，关系的拥有方会具有一条外键
    @JoinColumn()
    photo:Photo;
}