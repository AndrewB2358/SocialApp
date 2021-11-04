import express from "express"
import UsersCtrl from "./users.controller.js"

const router = express.Router()

router.route("/").get(UsersCtrl.apiGetUsers)

router
    .route("/update")
    .put(UsersCtrl.apiUpdateUser)
    .post(UsersCtrl.apiInsertUser)

export default router