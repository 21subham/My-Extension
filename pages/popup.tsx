"use client";

import React, { useState, useEffect } from "react";

const Popup = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is authenticated when the popup is opened
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      if (chrome.runtime.lastError || !token) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        fetchUserEmail(token);
      }
    });
  }, []);

  const fetchUserEmail = async (token: string) => {
    const response = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (data.emailAddress) {
      setUserEmail(data.emailAddress);
    }
  };

  const handleSignIn = () => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError || !token) {
        alert("Sign-in failed. Please try again.");
      } else {
        setIsAuthenticated(true);
        fetchUserEmail(token);
      }
    });
  };

  const handleSignOut = () => {
    chrome.identity.removeCachedAuthToken({ token: "" }, () => {
      setIsAuthenticated(false);
      setUserEmail(null);
    });
  };

  return (
    <div>
      <h3>Gmail Notifier</h3>
      {!isAuthenticated ? (
        <div>
          <p>Please sign in to receive notifications.</p>
          <button onClick={handleSignIn}>Sign In with Google</button>
        </div>
      ) : (
        <div>
          <p>Signed in as: {userEmail}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
};

export default Popup;
