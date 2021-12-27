import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    preferences: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Both"],
    },
    passions: {
      type: mongoose.Types.ObjectId,
      ref: "Passions",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      required: function () {
        return !this.password;
      },
    },
    refreshToken: {
      type: String,
    },
    accountType: {
      type: String,
      default: function () {
        if (!this.googleId) {
          return "User";
        } else {
          return "Google";
        }
      },
      enum: ["Google", "User"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const newUser = this;

  const password = newUser.password;

  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(password, 10);

    newUser.password = hash;
  }
  next();
});

userSchema.pre("update", async function (next) {
  const password = this.getUpdate().$set.password;
  if (!password) {
    return next();
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    this.getUpdate().$set.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

// this function is called automatically by express EVERY TIME it does res.send()
userSchema.methods.toJSON = function () {
  const userDocument = this;

  const user = userDocument.toObject();

  delete user.password;

  delete user.__v;

  return user;
};

userSchema.statics.checkCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export default model("User", userSchema);