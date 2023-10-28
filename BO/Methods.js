import { pool } from "../components/db/postgresPool.js";
import { SecurityController } from "../controllers/securityController.js";
import { registerUserQuery, blockUserQuery, resetAttemptsQuery,
    changeEmailQuery, changeUsernameQuery, changePasswordQuery,
    unlockUserQuery, changeProfileQuery, deleteUserProfileQuery,
    deleteUserQuery,
} from "../Queries.js";

export class Methods {
    static async registerUser(params){
        try {
            const salt = 'bf'
            const values = [params[0], params[1], salt, params[2], params[3], params[4], salt];
            await pool.query(registerUserQuery, values)
        } catch (error) {
            console.log("query error at registerUser", error)
        }
    }

    static async blockUser(params){
        try {
            await pool.query(blockUserQuery, [params[0]])
        } catch (error) {
            console.log("query error at blockUser", error)
        }
    }

    static async resetAttempts(params){
        try {
            await pool.query(resetAttemptsQuery, [params[0]])
        } catch (error) {
            console.log("query error at resetAttempts", error)
        }
    }

    static async changeEmail(params){
        try {
            await pool.query(changeEmailQuery, [params[1], params[0]])
        } catch (error) {
            console.log("query error at changeEmail", error)
        }
    }

    static async changeUsername(params){
        try {
            await pool.query(changeUsernameQuery, [params[1], params[0]])
        } catch (error) {
            console.log("query error at changeUsername", error)
        }
    }

    static async changePassword(params){
        try {
            const salt = 'bf'
            const values = [params[1], salt, params[0]]
            await pool.query(changePasswordQuery, values)
        } catch (error) {
            console.log("query error at changePassword", error)
        }
    }

    static async unlockUser(params){
        try {
            await pool.query(unlockUserQuery, [params[0]])
        } catch (error) {
            console.log("query error at blockUser", error)
        }
    }

    static async changeProfile(params){
        try {
            await pool.query(changeProfileQuery, [params[1], params[0]])
        } catch (error) {
            console.log("query error at changeProfile", error)
        }
    }
    
    static async deleteUser(params){
        try {
            await pool.query(deleteUserProfileQuery, [params[0]])
            await pool.query(deleteUserQuery, [params[0]])
        } catch (error) {
            console.log("query error at deleteUser", error)
        }
    }
}