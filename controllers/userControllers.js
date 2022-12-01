const { User } = require('../models/');

module.exports = {
    getUsers(req, res) {
        User.find()
        .then((users) =>
        res.status(200).json(users))
        .catch((err) =>
        res.status(500).json(err));
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId})
        .select('-__v')
        .populate('friends')
        .populate('thoughts')
        .then((user) => 
        !user
        ? res.status(404).json({
            message: `No user found with this id: ${req.params.userId}`
        })
        : res.status(200).json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    createUser(req, res) {
        User.create(req.body)
        .then((user) =>
        res.status(200).json(user))
        .catch((err) =>
        res.status(500).json(err));
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true },
        )
        .then((user) => 
        !user
        ? res.status(404).json({
            message: `No user found with this id: ${req.params.userId}`
        })
        : res.status(200).json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    deleteUser(req, res) {
        User.findOneAndDelete(
            { _id: req.params.userId },
        )
        .then((user) =>
        !user
        ? res.status(404).json({
            message: `No user with this id: ${req.params.userId}`
        })
        : res.status(200).json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId }},
        )
        .then((user) =>
        !user
        ? res.status(404).json({
            message: `No user with this id: ${req.params.userId}`
        })
        : res.status(200).json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId }},
        )
        .then((user) =>
        !user
        ? res.status(404).json({
            message: `No user with this id: ${req.params.userId}`
        })
        : res.status(200).json(user)
        )
        .catch((err) => res.status(500).json(err));
    }
}