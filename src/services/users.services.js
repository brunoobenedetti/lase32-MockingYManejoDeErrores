import { userRepository } from '../repositories/index.js'

export default class UsersService {

    static findAll(filter = {}) {
        return userRepository.get(filter)
    }
    static async create(payload) {
        console.log("Creando un nuevo usuario");
        const user = await userRepository.create(payload)
        console.log(`Usuario creado correctamente (${user._id})`)
        return user;
    }

    static async findById(uid) {
        return userRepository.getCurrent(uid)
    }
    static updateById(uid, payload) {
        return UserDao.updateById(uid, payload);

    }
    static deleteById(uid) {
        return UserDao.deleteById(uid)
    }
}