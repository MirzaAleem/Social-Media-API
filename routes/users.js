const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');

// Update user
router.put('/:id', async (req,res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body,});
            return res.status(200).json('Account has been Updated Successfully !')
        } catch (error) {
           return res.status(500).json(error)
        }
    }
    else{
        return res.status(403).json('You can only update your account');
    }
})

// Delete user
router.delete('/:id', async (req,res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            return res.status(200).json('Account has been Deleted.')
        } catch (error) {
           return res.status(500).json(error)
        }
    }
    else{
        return res.status(403).json('You can only Delete your account');
    }
})

// Get user
router.get('/:id', async (req,res) =>{
    try {
        const user = await User.findById(req.params.id);
        const {password,updatedAt, ...other} = user._doc       //user._doc is the full document i.e. username,password, etc.
       return res.status(200).json(other)
    } catch (error) {
        return res.status(500).json(error)
    }
})
// Follow user
router.put('/:id/follow', async (req,res) =>{             //here :id will be the id of user you want to follow
    if(req.body.userId !== req.params.id){          //req.body.userId is your ID (the Admin)
        try {
            const user = await User.findById(req.params.id)        //user is one you want to follow
            const currentUser = await User.findById(req.body.userId)   //currentUser is you yourself
            if(!currentUser.followings.includes(req.params.id)){
                await user.updateOne({$push: {followers: req.body.userId}})
                await currentUser.updateOne({$push: {followings: req.params.id}})
                return res.status(200).json('You have started following ' + user.username)
            }
            else{
                return res.status(403).json('You already follow this user.')
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    else{
        return res.status(403).json('You cannot follow Yourself')
    }
})

// Unfollow user
router.put('/:id/unfollow', async (req,res) =>{             //here :id will be the id of user you want to unfollow
    if(req.body.userId !== req.params.id){          //req.body.userId is your ID (the Admin)
        try {
            const user = await User.findById(req.params.id)        //user is one you want to follow
            const currentUser = await User.findById(req.body.userId)   //currentUser is you yourself
            if(currentUser.followings.includes(req.params.id)){
                await user.updateOne({$pull: {followers: req.body.userId}})
                await currentUser.updateOne({$pull: {followings: req.params.id}})
                return res.status(200).json('You have unfollowed ' + user.username)
            }
            else{
                return res.status(403).json('You have not followed this user')
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    else{
        return res.status(403).json('You cannot unfollow Yourself')
    }
})

module.exports = router;