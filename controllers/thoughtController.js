const { Thought, User } = require('../models/');

module.exports = {
    getThoughts(req, res) {
        Thought.find()
        .then((thoughts) => res.status(200).json(thoughts))
        .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then(( thought ) =>
        !thought
        ? res.status(404).json({ message: 'No thought found with that id' })
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    createThought(req, res) {
        Thought.create(req.body)
        .then(( thought ) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id}},
                { new: true }
            );
        })
        .then((user) =>
        !user 
        ? res.status(404).json({
            message: `No user found with this id: ${req.body.userId}, thought created without user`
        })
        : res.status(200).json(`Added thought to user with this id: ${req.body.userId}`)
        )
        .catch((err) => res.status(500).json(err));
    },
    updateThought( req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((thought) =>
        !thought
        ? res.status(404).json({
            message: `No thought with this id: ${req.params.thoughtId}`
        })
        : res.status(200).json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res) {
        Thought.findOneAndRemove(
            { _id: req.params.thoughtId}
        )
        .then((thought) =>
        !thought
        ? res.status(404).json({
            message: `No thought found with this id: ${req.params.thoughtId}`
        })
        : User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId }},
            { new: true }
            )
        )
        .then((user) =>
        !user
        ? res.status(404).json({
            message: `No user found with this id, thought deleted`
        })
        : res.json(200).json({
            message: `Thought with this id: ${req.params.thoughtId} has been deleted`
        })
        )
        .catch((err) => res.status(500).json(err));
    },
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body}},
            { runValidators: true, new: true }
        )
        .then((thought) =>
        !thought
        ? res.status(404).json({
            message: `No thought with this id: ${req.params.thoughtId}`
        })
        : res.status(200).json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId}}},
            { runValidators: true, new: true }
        )
        .then((thought) =>
        !thought
        ? res.status(404).json({
            message: `No thought found with this id: ${req.params.thoughtId}`
        })
        : res.status(200).json(thought)
        )
        .catch((err) => res.status(500).json(err));
    }
}