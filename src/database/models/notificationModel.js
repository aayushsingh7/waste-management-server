import { Schema, model } from "mongoose";

const notificationSchema = new Schema({});

const Notification = model("notification", notificationSchema);

export default Notification;
