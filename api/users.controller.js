import UsersDAO from "../dao/usersDAO.js"
import mongodb from "mongodb"

export default class UsersController{
    static async apiGetUsers(req, res, next){
        const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10): 0

        const { usersList, totalNumUsers } = await UsersDAO.getUsers({
        page,
        usersPerPage,    
        }) 

        let response = {
            users: usersList,
            page: page,
            entries_per_page: usersPerPage,
            total_results : totalNumUsers,
        }
        res.json(response)
    }

    static async apiInsertUser(req, res, next){
        try{
            //const userId = ObjectId() userId is generated in the addUser method
            const name = req.query.name //was req.body
            
            const description = req.query.description
            

            const ReviewResponse = await UsersDAO.addUser(
                name,
                description,
            )
            res.json({status:"success"})
        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

    static async apiUpdateUser(req, res, next){
        try{
            const userId = req.query._id
            const name = req.query.name
            const description = req.query.description
            
            const userResponse = await UsersDAO.updateUser(
                userId,
                name,
                description,
            )

            var {error} = userResponse
            if (error){
                res.status(400).json({error})
            }

            if (userResponse.modifiedCount ===0){
                throw new Error(
                    "unable to update profile - user may not be owner of account",
                )
            }
            res.json({status:"success"})
        }catch(e){
            res.status(500).json({error: e.message})
        }
    }


}