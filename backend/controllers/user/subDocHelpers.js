import User from "../../models/user/User.js";

// Update a sub-document
export const updateSubDoc = async (userId, subDocArray, subDocId, updates) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const subDoc = user[subDocArray].id(subDocId);
  if (!subDoc) throw new Error("Item not found");

  Object.assign(subDoc, updates);
  await user.save();
  return subDoc;
};


// Generic helper to delete sub-documents safely
export const deleteSubDoc = async (userId, subDocArray, subDocId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const originalLength = user[subDocArray].length;

  // Remove the subdocument by ObjectId
  user[subDocArray].pull(subDocId);

  if (user[subDocArray].length === originalLength) {
    throw new Error("Item not found");
  }

  await user.save();
  return;
};
