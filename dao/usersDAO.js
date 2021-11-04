import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let users

export default class UsersDAO{
    static async injectDB(conn){
        if (users){
            return
        }
        try{
            users = await conn.db(process.env.USERS_NS).collection("myusers")
        } catch(e){
            console.error(
                `Unable to establish a collection handle in usersDAO: ${e}`,
            )
        }
    }


static async getUsers({
    page=0, //no filters
    usersPerPage=20
}={}) {
    //let query unsure if ever going to need this 
    
    let cursor 

    try {
        cursor = await users
            .find() //had query as arg
    } catch(e) {
        console.error(`Unable to issue find command, ${e}`)
        return { usersList: [], totalNumUsers:0}
    }

    const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage*page)

    try{
        const usersList=await displayCursor.toArray()
        const totalNumUsers = await users.countDocuments() //had query as arg

        return { usersList, totalNumUsers}
    } catch(e){
        console.error(
            `Unable to convert cursor to array or problem counting documents, ${e}`,
        )
        return {usersList: [], totalNumUsers:0}
    }
 }

 static async addUser(myName, myDescription){
     try{ console.log(myName)
         const userDoc = { name: myName,
            description: myDescription,}

            return await users.insertOne(userDoc)
     }catch(e){
         console.error(`Unable to post user ${e}`)
         return{error:e}
     }
 }

 static async updateUser(userId, myName, myDescription){
     try{
       let userID=ObjectId(userId)
       console.log("ID here" + userID)
         const updateResponse = await users.updateOne(
             {_id: userID},
             {$set:{name:myName, description:myDescription}},
         )
         return updateResponse
     }catch(e){
         console.error(`Unable to update user: ${e}`)
         return {error:e}
     }
 }



}