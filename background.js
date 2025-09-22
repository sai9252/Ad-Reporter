
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dnrcunwfqwwimnyqrusj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRucmN1bndmcXd3aW1ueXFydXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MjE5MDAsImV4cCI6MjA3NDA5NzkwMH0.lNkMbB2xMbgK-KJrt1rGV7TblNUrJJij3DoObbuX9mY";
export const supabase = createClient(supabaseUrl, supabaseKey);

// Background script for Facebook Post Extension

chrome.runtime.onInstalled.addListener(() => {
    console.log('Facebook Post Extension installed');
});



// Handle messages from content script
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === 'iconClicked') {
        console.log('Icon clicked on post:', request.postContent);

        // You can add additional background processing here
        // For example: analytics, API calls, etc.

        sendResponse({ success: true });
    }
    if (request.action === "saveLink" && request.link) {
        const { data, error } = await supabase
            .from("Link")
            .insert([{ url: request.link }]);
        if (error) {
            sendResponse({ success: false, error });
        } else {
            sendResponse({ success: true, data });
        }
        return {
            success: true
        };
    }
});




// Optional: Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, { action: 'toggleExtension' });
});






