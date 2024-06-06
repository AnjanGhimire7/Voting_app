import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    party: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    candidatePhoto: {
      type: String, ///cloudinary url
      required: true,
    },
    votes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        votedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    voteCount: {
      type: Number,
      defaut: 0,
    },
  },
  { timestamps: true }
);
const Candidate = mongoose.model("Candidate", candidateSchema);
export { Candidate };
