
const users = require("../model/register")


exports.userDetails = async(req, res) => {
    const user = await users.findOne({_id:req.user.id});
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({id : user._id , username : user.username , phoneNumber:user.phoneNumber});
}