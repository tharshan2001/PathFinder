import Notification from "../models/user/Notification.js";
import User from "../models/user/User.js";

export const createNotification = async ({ recipientId, type, message, from, relatedId }) => {
  try {
    const notification = await Notification.create({
      userId: recipientId,
      type,
      message,
      from: from ? { userId: from._id, name: from.name, profileMedia: from.profileMedia } : undefined,
      relatedId,
      isRead: false
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export const notifyConnectionRequest = async (requester, recipient) => {
  await createNotification({
    recipientId: recipient._id,
    type: "connection_request",
    message: `${requester.name} sent you a connection request`,
    from: requester,
    relatedId: requester._id
  });
};

export const notifyConnectionAccepted = async (requester, recipient) => {
  await createNotification({
    recipientId: requester._id,
    type: "connection_accepted",
    message: `${recipient.name} accepted your connection request`,
    from: recipient,
    relatedId: recipient._id
  });
};

export const notifyMessage = async (sender, recipient) => {
  await createNotification({
    recipientId: recipient._id,
    type: "message",
    message: `${sender.name} sent you a message`,
    from: sender,
    relatedId: sender._id
  });
};

export const notifyJobApplication = async (applicant, job, employer) => {
  await createNotification({
    recipientId: employer._id,
    type: "job_alert",
    message: `${applicant.name} applied for ${job.title}`,
    from: applicant,
    relatedId: job._id
  });
};

export const notifyCourseEnrollment = async (student, course, instructor) => {
  await createNotification({
    recipientId: instructor._id,
    type: "course_recommendation",
    message: `${student.name} enrolled in ${course.title}`,
    from: student,
    relatedId: course._id
  });
};

export const notifyForumReply = async (author, post, replier) => {
  await createNotification({
    recipientId: author._id,
    type: "forum_reply",
    message: `${replier.name} replied to your post "${post.title}"`,
    from: replier,
    relatedId: post._id
  });
};

export const notifySkillEndorsement = async (endorser, user, skill) => {
  await createNotification({
    recipientId: user._id,
    type: "skill_endorsement",
    message: `${endorser.name} endorsed your skill: ${skill}`,
    from: endorser,
    relatedId: user._id
  });
};

export const notifyProfileView = async (viewer, user) => {
  await createNotification({
    recipientId: user._id,
    type: "profile_view",
    message: `${viewer.name} viewed your profile`,
    from: viewer,
    relatedId: viewer._id
  });
};

export const notifyJobAlert = async (user, jobTitle) => {
  await createNotification({
    recipientId: user._id,
    type: "job_alert",
    message: `New job matching your preferences: ${jobTitle}`,
    relatedId: user._id
  });
};