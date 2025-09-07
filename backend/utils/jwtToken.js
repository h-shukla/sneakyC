// Creating token and saving in cookie
const sendToken = (user, statusCode, res, rememberMe) => {
    const token = user.getJWTToken();

    const options = {
        httpOnly: true,
    };

    if (rememberMe) {
        options.expires = new Date(Date.now() + 24 * 60 * 60 * 30);
    }

    res.cookie("token", token, options);
    const userDetails = {
        // id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    res.status(statusCode).json({
        success: true,
        userDetails,
        token,
    });
};

module.exports = sendToken;
