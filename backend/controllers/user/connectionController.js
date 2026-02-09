import Connection from "../../models/user/connectionRef.js";
import User from "../../models/user/User.js";

// Send connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const { requesterId, recipientId } = req.body;

    if (requesterId === recipientId) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    const existing = await Connection.findOne({
      requester: requesterId,
      recipient: recipientId
    });

    if (existing) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const connection = await Connection.create({
      requester: requesterId,
      recipient: recipientId
    });

    res.status(201).json({ message: "Connection request sent", connection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept connection request
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    connection.status = "accepted";
    await connection.save();

    // update counts
    await User.findByIdAndUpdate(connection.requester, {
      $inc: { connectionsCount: 1 }
    });

    await User.findByIdAndUpdate(connection.recipient, {
      $inc: { connectionsCount: 1 }
    });

    res.json({ message: "Connection accepted", connection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove connection
export const removeConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    if (connection.status === "accepted") {
      await User.findByIdAndUpdate(connection.requester, {
        $inc: { connectionsCount: -1 }
      });
      await User.findByIdAndUpdate(connection.recipient, {
        $inc: { connectionsCount: -1 }
      });
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
    const { userId } = req.params;

    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted"
    })
      .populate("requester recipient", "name headline profileMedia");

    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending requests
export const getPendingRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const requests = await Connection.find({
      recipient: userId,
      status: "pending"
    }).populate("requester", "name headline profileMedia");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Reject connection request
export const rejectConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Only pending requests can be rejected
    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Connection already processed" });
    }

    await connection.deleteOne();

    res.json({ message: "Connection request rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
