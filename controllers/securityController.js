import { pool } from "../components/db/postgresPool.js";
import { setPermissionKeys } from "../components/setPermissionKeys.js";
import { getProfileQuery, getMethodObjectModuleQuery } from '../Queries.js'

export class SecurityController{
    constructor(username){
        this.username = username
        this.userPermissionsMap = new Map()
        this.init()
    }

    async init(){
        await this.loadPermissions()
    }

    async getProfile(){
        try {
            const data = await pool.query(getProfileQuery, [this.username])
            return data.rows[0].des_profile
        } catch (error) {
            return console.log("query error at getProfile", error)
        }
    }

    async loadPermissions(){
        try {
            const data = await pool.query(getMethodObjectModuleQuery, [this.username])
            const userProfile = await this.getProfile(this.username)
            this.userPermissionsMap = setPermissionKeys(userProfile, data.rows)
            console.log(this.userPermissionsMap)
        } catch (error) {
            return console.log("query error at loadPermissions", error)
        }
    }

    static setPermissionStatus(keytoModify){
        if(this.userPermissionsMap.has(keytoModify)){
            this.userPermissionsMap.set(keytoModify, !this.userPermissionsMap.get(keytoModify))
            console.log(this.userPermissionsMap)
            return true
        }else{
            console.log(`The key ${keytoModify} does not exist in the userPermissionsMap.`)
            return false
        }
    }
}