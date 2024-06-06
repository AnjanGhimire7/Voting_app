import { Candidate } from "../models/candidate.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { User } from "../models/user.model.js";

const checkingAdmin = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user.role === "Admin") {
      return true;
    }
  } catch (error) {
    return error;
  }
};

const candidateUser = asyncHandler(async (req, res) => {
  if (!(await checkingAdmin(req.validUser?._id))) {
    throw new ApiError(403, "Not a admin user!!!");
  }

  const { fullName, age, party, voteCount } = req.body;
  if ([fullName, age, party].some((field) => field?.trim() === "")) {
    throw new ApiError(403, "all the field are requird");
  }
  const existedCandidate = await Candidate.findOne({
    $and: [{ fullName }, { party }],
  });
  if (existedCandidate) {
    throw new ApiError(403, "candidate with this name and party exist!!!");
  }

  const candidatePhotoLocalPath = req.file?.path;
  if (!candidatePhotoLocalPath) {
    throw new ApiError(403, "candidate local file path doesn't exist!!!");
  }
  const candidatePhoto = await uploadOnCloudinary(candidatePhotoLocalPath);
  if (!candidatePhoto) {
    throw new ApiError(403, "failed to upload the photo !!!");
  }
  const candidate = await Candidate.create({
    fullName,
    age,
    party,
    candidatePhoto: candidatePhoto?.url,
    voteCount: 0,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, candidate, "candidate created successfully!!!"));
});

const updateCandidate = asyncHandler(async (req, res) => {
  if (!(await checkingAdmin(req.validUser?._id))) {
    throw new ApiError(403, "Not a admin user!!!");
  }

  const candidateID = req.params.candidateID; //extract the Id from url parameter
  const { fullName, age } = req.body;
  if (!(fullName && age)) {
    throw new ApiError(403, "all the fields are required!!!");
  }
  const updatedCandidateUser = await Candidate.findByIdAndUpdate(
    candidateID,
    {
      $set: {
        fullName,
        age,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCandidateUser)
    throw new ApiError(403, "failed to update the candidate fields!!!");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCandidateUser,
        "successfully updated the candidate fields!!!"
      )
    );
});

const deleteCandidate = asyncHandler(async (req, res) => {
  if (!(await checkingAdmin(req.validUser?._id))) {
    throw new ApiError(403, "Not a admin user!!!");
  }

  const candidateID = req.params.candidateID;

  const deletedCandidateUser = await Candidate.findByIdAndDelete(candidateID);
  if (!deletedCandidateUser) {
    throw new ApiError(403, "Failed to deleted candidate fields !!!");
  }
  return res.status(200).json(200, {}, "successfully deleted candidate!!!");
});

const votingCandidate = asyncHandler(async (req, res) => {
  const candidateID = req.params?.candidateID;
  const userId = req.validUser?._id;
  try {
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      throw new ApiError(403, "candidate not found!!!");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(403, "user not found!!!");
    }
    if (user.role === "Admin") {
      throw new ApiError(403, "admin user cannot vote!!!");
    }
    if (user.isVoted) {
      throw new ApiError(403, "User had already voted!!!");
    }

    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    // update the user document
    user.isVoted = true;
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Succssfully voted!!!"));
  } catch (error) {
    throw new ApiError(403, "Failed to Vote the Candidates!!!");
  }
});
const totalVoteCount = asyncHandler(async (_, res) => {
  // _ means request as we can write underscore when there is no use of request object

  try {
    // Find all candidates and sort them by voteCount in descending order and selecting party,votecount and fullName
    const recordVoted = await Candidate.find()
      .sort({ voteCount: "desc" })
      .select("party voteCount fullName -_id");

    return res
      .status(200)
      .json(
        new ApiResponse(200, recordVoted, "Successfully showing total votes!!!")
      );
  } catch (error) {
    throw new ApiError(403, "failed to show all the votes!!!");
  }
});
const allCandidateUser = asyncHandler(async (_, res) => {
  const candidate = await Candidate.find().select("fullName party age -_id"); /// finding all the fields in candidate document and selecting only in the basis of fullName,Age,party and excluding _id
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        candidate,
        "All the candidates shown sucessfully !!!"
      )
    );
});
export {
  candidateUser,
  updateCandidate,
  deleteCandidate,
  votingCandidate,
  totalVoteCount,
  allCandidateUser,
};
