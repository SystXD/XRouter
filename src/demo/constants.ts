const userMap = new Map()

export function getUser(userName: string){
    return userMap.get(userName)
}

export function addUser(userName: string){
    return userMap.set(userName, crypto.randomUUID())
}