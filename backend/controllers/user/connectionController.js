import Connection from "../../models/user/connectionRef.js";
import User from "../../models/user/User.js";
import { notifyConnectionRequest, notifyConnectionAccepted } from "../../services/notificationService.js";

const populateFields = "requester recipient";

// Send connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const { recipientId, message } = req.body;

    if (requesterId === recipientId) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    const existing = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: "A connection or request already exists between these users" });
    }

    const [requester, recipient] = await Promise.all([
      User.findById(requesterId),
      User.findById(recipientId)
    ]);

    const connection = await Connection.create({
      requester: requesterId,
      recipient: recipientId,
      message
    });

    await notifyConnectionRequest(requester, recipient);

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

    if (connection.recipient.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    connection.status = "accepted";
    await connection.save();

    const [requester, recipient] = await Promise.all([
      User.findById(connection.requester),
      User.findById(connection.recipient)
    ]);

    await User.findByIdAndUpdate(connection.requester, { $inc: { connectionsCount: 1 } });
    await User.findByIdAndUpdate(connection.recipient, { $inc: { connectionsCount: 1 } });

    await notifyConnectionAccepted(requester, recipient);

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

    if (![connection.requester.toString(), connection.recipient.toString()].includes(userId)) {
      return res.status(403).json({ message: "You are not authorized to remove this connection" });
    }

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