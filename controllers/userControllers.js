const { User, Thought } = require('../models/');

module.exports = {
    getUsers(req, res) {
        User.find()
        .then((users) =>
        res.status(200).json(users))
        .catch((err) =>
        res.status(500).json(err));
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.param.userId})
        .select('-__v')
        .populate('friends')
        .populate('thoughts')
        .then((user) => 
        !user
        ? res.status(404).json({
            message: `No user found with this id: ${req.param.userId}`
        })
        : res.status(200).json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    
}