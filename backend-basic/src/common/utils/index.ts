import { HttpException } from "@nestjs/common"

const checkId = (id:any)=>{
    console.log(id,"aaa",(typeof id !== 'number'));
    // if(typeof id !== 'number') throw new HttpException("id必须为数字",202);
    if(id.toString() === 'NaN') throw new HttpException("id必须为数字",202);
    return
}
const checkAll = (key:string,value:any)=>{
    // if(typeof id !== 'number') throw new HttpException("id必须为数字",202);
    if(value.toString() === 'NaN') throw new HttpException(key+"必须为数字",202);
    return
}


const parseIdToNumber = (id:any):number=>{
    if(!id){return}
    let numId = parseInt(id);
    checkId(numId);
    return numId;
}
const parseColumnToNumber = (key:string,value:any):number=>{
    if(value == null) return
    let toNum = parseInt(value);
    checkAll(key,toNum);
    return toNum;
}

export {
    checkId,
    parseIdToNumber,
    parseColumnToNumber
};