export const setPermissionKeys = (userProfile, permissionsObject) => {
    const permissionMap = new Map()

    permissionsObject.forEach(p => {
        const { method, object, module } = p
        const key = `${userProfile}_${method}_${object}_${module}`
        permissionMap.set(key, { sts: true })
    })

    return permissionMap
}