const Validator=require('validator');
const isEmpty=require('./isEmpty')
module.exports=function validateRegister(data){
    let errors={}
    data.username=!isEmpty(data.username)?data.username:'';
    data.password=!isEmpty(data.password)?data.password:'';
    if(!Validator.isLength(data.username,{min:2,max:30})){
        errors.username='名字长度必须大于2位小于30位'
    }
    if(!Validator.isLength(data.password,{min:6,max:30})){
        errors.password='密码长度必须大于6位小于30位'
    }
    if(Validator.isEmpty(data.username)){
        errors.username='名字不能为空'
    }
    if(Validator.isEmpty(data.password)){
        errors.password='密码不能为空'
    }
    // if(Validator.isEmpty(data.password2)){
    //     errors.password2='密码不能为空'
    // }
    // if(!Validator.equals(data.password,data.password2)){
    //     errors.password2='两次密码不一致'
    // }
    return {errors,isValid:isEmpty(errors)};
}