  import mongoose from "mongoose";

  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String,
      enum: ['hod', 'teacher', 'admin', 'student'], // Define the roles you expect
      default: 'student', // Assign a default role for new users if not specified
      required: true // Or false if you want it optional initially
    },

    // // For email verification (uncomment these if you use them)
    // verifyOtp: { type: String, default: "" },
    // verifyOtpExpireAt: { type: Date, default: null },
    // isAccountVerified: { type: Boolean, default: false },

    // // For password reset (uncomment these if you use them)
    // resetOtp: { type: String, default: "" },
    // resetOtpExpireAt: { type: Date, default: null },


    
  }, { timestamps: true });

  const userModel = mongoose.models.User || mongoose.model("User", userSchema);

  export default userModel;