const models = require('../models/models')


module.exports = class userService{

    getUserByEmail(email){
        return new Promise ((resolve, reject)=>{
            models.user
            .where({email: email})
            .fetch({required: true})
            .then(user=>{
                if(user){
                    resolve(user)
                }else{
                    reject({success: false, status: 404, errors: [`User not found`]})
                }
            })
        })
    }

    checkUserEmail(email){
        return new Promise ((resolve, reject)=>{
            models.user
            .where({email: email})
            .fetch()
            .then(user=>{
                if(user){
                    reject({success: false, status: 500, errors: [`User with this email already exists`]})       
                }else{
                    resolve()
                }
            })
        })
    }

    createUser(data){
        return new Promise((resolve, reject)=>{
            models.user
            .forge(data)
            .save()
            .then(result => {
                if(result){
                    resolve({success: true, id: result.get('id'), token: result.get('token'), avatar: result.get('avatar')})
                }else{
                    reject({success: false, status: 500, errors: [`Error while seving user in DB`]})
                }        
            })
        })
    }

    updateUser(email, data){
        return new Promise ((resolve, reject)=>{
            this.getUserByEmail(email)
            .then(user=>{
                return user.save(data)
            })
            .then(user=>{
                if(user){
                    resolve(user)
                }else{
                    reject({success: false, status: 500, errors: [`Error while seving user in DB`]})
                }
            })
        })
    }

    checkAuthorization(userId, token){
        return new Promise((resolve, reject)=>{
            models.user
            .query((qb) => {
                qb
                .where({id: userId})
                .andWhere({token: token})
            })
            .fetch({required: true})
            .then(user => {
                if(user){
                    resolve(user)
                }else{
                    reject({success: false, status: 403,  errors: [`Unauthorized.`]})
                }
            })
        })
    }
}