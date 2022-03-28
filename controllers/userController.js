const {UserModel, validate} = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

         UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    /**
     * userController.create()
     */
    create: async function (req, res) {

        const {name, email, userType, password} = req.body;
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let encryptedPassword = await bcrypt.hash(password, 10);

        const oldUser = await UserModel.findOne({ email });
        if (oldUser) return res.status(409).send("User Already Exist");

        var user = new UserModel({
			name : name,
            email : email.toLowerCase(),
            password : encryptedPassword,
			userType : userType
        });

        await user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }

            return res.status(201).json(user);
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        let id = req.params.id;
        const {name, email, userType, password} = req.body;

        UserModel.findOne({_id: id}, async function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            if(email != user.email){
                const oldUser = await UserModel.findOne({ email });
                if (oldUser) return res.status(409).send("User Already Exist");
            }

            user.name = name? name : user.name;
			user.email = email ? email : user.email;
			user.userType = userType ? userType : user.userType;
            if (!password) {
                let encryptedPassword = await bcrypt.hash(password, 10);

                user.password = encryptedPassword;
            }
			
            await user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.json({message: 'User Successfully Deleted!'});
        });
    }
};
