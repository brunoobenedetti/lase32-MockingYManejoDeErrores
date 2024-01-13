import UserModel from "../models/user.model.js";

export default class UserDao {
    get(criteria = {}) {
        return UserModel.find(criteria)
    }

    create(data) {
        console.log("data", data)
        return UserModel.create(data)
    }

    getById(uid) {
        return UserModel.findById(uid);
    }

    updateById(uid, data) {
        return UserModel.updateOne({ _id: uid }, { $set: data })
    }

    deleteById(uid) {
        return UserModel.deleteOne({ _id: uid })
    }
}