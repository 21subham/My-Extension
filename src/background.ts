"use client";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed successfully");

  checkForNewEmails();

  chrome.notifications.create(
    "new-email-notification",
    {
      type: "basic",
      iconUrl: "icons/notification_icon.png",
      title: "New Gmail Notification",
      message: "You have a new email!",
    },
    (notificationId) => {
      console.log(`Notification created with ID: ${notificationId}`);
    }
  );
});

const checkForNewEmails = async () => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/messages",
      {
        headers: {
          Authorization: `Bearer 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`,
        },
      }
    );

    const data = await response.json();
    console.log("New emails fetched: ", data);

    if (data.messages && data.messages.length > 0) {
      chrome.notifications.create("new-email-notification", {
        type: "basic",
        iconUrl: "icons/notification_icon.png",
        title: "New Gmail Notification",
        message: "You have a new email!",
      });
    }
  } catch (error) {
    console.error("Error fetching Gmail data: ", error);
  }
};
