import Connection from "../../models/user/connectionRef.js";
import User from "../../models/user/User.js";

// Send connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const { recipientId, message } = req.body;

    if (requesterId === recipientId) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    // Check if a connection already exists (either direction)
    const existing = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: "A connection or request already exists between these users" });
    }

    const connection = await Connection.create({
      requester: requesterId,
      recipient: recipientId,
      message
    });

    res.status(201).json({ message: "Connection request sent", connection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept connection request
export const acceptConnectionRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { connectionId } = req.body;

    const connection = await Connection.findById(connectionId);
    if (!connection) return res.status(404).json({ message: "Connection request not found" });

    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Connection request already processed" });
    }

    // Only recipient can accept
    if (connection.recipient.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    connection.status = "accepted";
    await connection.save();

    // Increment connections count for both users
    await User.findByIdAndUpdate(connection.requester, { $inc: { connectionsCount: 1 } });
    await User.findByIdAndUpdate(connection.recipient, { $inc: { connectionsCount: 1 } });

    res.json({ message: "Connection accepted", connection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject connection request
export const rejectConnectionRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { connectionId } = req.body;

    const connection = await Connection.findById(connectionId);
    if (!connection) return res.status(404).json({ message: "Connection request not found" });

    // Only recipient can reject
    if (connection.recipient.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to reject this request" });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Connection request already processed" });
    }

    await connection.deleteOne();
    res.json({ message: "Connection request rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove connection
export const removeConnection = async (req, res) => {
  try {
    const userId = req.user.id;
    const { connectionId } = req.body;

    const connection = await Connection.findById(connectionId);
    if (!connection) return res.status(404).json({ message: "Connection not found" });

    // Only requester or recipient can remove
    if (![connection.requester.toString(), connection.recipient.toString()].includes(userId)) {
      return res.status(403).json({ message: "You are not authorized to remove this connection" });
    }

    // Decrement connections count if accepted
    if (connection.status === "accepted") {
      await User.findByIdAndUpdate(connection.requester, { $inc: { connectionsCount: -1 } });
      await User.findByIdAndUpdate(connection.recipient, { $inc: { connectionsCount: -1 } });
    }

    await connection.deleteOne();
    res.json({ message: "Connection removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user connections
export const getUserConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted"
    }).populate("requester recipient", "name headline profileMedia");

    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending requests
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Connection.find({
      recipient: userId,
      status: "pending"
    }).populate("requester", "name headline profileMedia");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
