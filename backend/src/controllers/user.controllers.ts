import { Request, Response } from "express";
import User from "../models/user.models.js";
import { Document, ObjectId } from "mongodb";

const getAccessTokenAndRefreshToken = async (userID: ObjectId) => {
  try {
    const user = await User.findById(userID);
  
    const accessToken = (user as Document)?.generateAccessToken();
    const refreshToken = (user as Document)?.generateRefreshToken();
  
    (user as any).refreshToken = refreshToken;
    await (user as any).save({ validateBeforeSave: false });
  
    return { accessToken, refreshToken };
  } catch (error) {
        throw new Error("An error occurred while generating jwt token for the user.");
  }
};

const userLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (username.trim() === "") {
      res
        .status(422)
        .json({ statusCode: "422", error: "Username cannot be empty" });
    }
    if (password.trim() === "") {
      res
        .status(422)
        .json({ statusCode: "422", error: "Password cannot be empty" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      res
        .status(401)
        .json({ statusCode: "401", message: "User does not exist." });
    }

    const isPasswordValid = await (user as Document).isPasswordCorrect(
      password
    );

    if (!isPasswordValid) {
      res.status(401).send({ statusCode: 401, message: "Incorrect password." });
    }

    const { accessToken, refreshToken } = await getAccessTokenAndRefreshToken(
      (user as Document)?._id as ObjectId
    );

    const loggedInUser = await User.findById((user as Document)?._id).select(
      "-password -refreshToken"
    );

    const cookieOptions = {
      httpOnly: false,
      secure: false,
    };

    res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        statusCode: "201",
        message: "Login Successful.",
        data: { username, password },
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.log(error);
    return;
  }
};

const userSignup = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  try {
    if ([username, password, email].includes("")) {
      res.status(422).json({ statusCode: "422", error: "Fill all details" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        statusCode: 409,
        message: `A user with the username '${username}' already exists.`,
      });
    }

    // Create a new user
    const newUser = await User.create({
      username,
      password,
      email,
    });

    // Fetch the created user data excluding sensitive information
    const createdUserData = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    // Respond with success status and user data
    return res.status(201).json({
      statusCode: 201,
      data: createdUserData,
      message: "User Registered Successfully.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "An error occurred while registering the user.",
    });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    const cookieOptions = {
      httpOnly: false,
      secure: false,
    };

    res
      .status(204)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .send({ statusCode: 204, message: "Logged out successfully." }); // Sending response
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Server Error. Could not Log Out User.",
    });
  }
};

const getLoggedInUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select(
      "-refreshToken -password -email  -createdAt -updatedAt"
    );

    if (!user) {
      res
        .status(401)
        .json({ statusCode: "401", message: "User does not exist." });
    }

    res.status(200).json({ statusCode: "200", message: user });
    return res;
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Something went wrong" });
  }
};

export { userLogin, userSignup, logoutUser, getLoggedInUser, getAccessTokenAndRefreshToken };
