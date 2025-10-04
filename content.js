// Facebook Post Header Extension - Modified for Sequential Clicking and Iframe Extraction
console.log('Facebook Post Header Extension loaded');


class FacebookPostHeaderExtension {
    constructor() {
        // --- CONFIGURATION ---
        // Using a stable attribute selector to find the "More options" button in a post.
        this.ACTION_BUTTON_SELECTOR = '[aria-label*="Actions for this post"], [aria-label*="More options"]';

        // The three selectors provided by user
        this.SELECTOR_PATHS = {
            first: '#mount_0_0_no > div > div:nth-child(1) > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1t2pt76.x17upfok > div > div.x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1iyjqo2.xs83m0k.xeuugli.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1iplk16.x1mfogq2.xsfy40s.x1wi7962.xpi1e93 > div > div > div > div.x78zum5.x1q0g3np.xl56j7k > div > div.x1hc1fzr.x1unhpq9.x6o7n8i > div > div:nth-child(3) > div:nth-child(2) > div > span > div > span > div > div > div > div > div > div > div > div > div > div > div > div.html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl > div > div > div:nth-child(2) > div > div.xqcrz7y.x78zum5.x1qx5ct2.x1y1aw1k.xf159sx.xwib8y2.xmzvs34.xw4jnvo > div > div[role="button"]',
            second: '#mount_0_0_XE > div > div:nth-child(1) > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div:nth-child(2) > div > div > div.xu96u03.xm80bdy.x10l6tqk.x13vifvy > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div > div > div.x78zum5.xdt5ytf.x1iyjqo2.x1n2onr6 > div > div:nth-child(8) > div.html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x6s0dn4.x78zum5.x1q0g3np.x1iyjqo2.x1qughib.xeuugli > div > div > span[dir="auto"]',
            iframe: '#mount_0_0_8q > div > div:nth-child(1) > div > div:nth-child(5) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div.xyamay9.xv54qhq.x1l90r2v.xf7dkkf > iframe'
        };

        // --- STATE ---
        this.processedHeaders = new Set();
        this.observer = null;

        this.init();
    }

    waitForChromeAPI() {
        return new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                resolve();
            } else {
                const checkChrome = () => {
                    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                        resolve();
                    } else {
                        setTimeout(checkChrome, 100);
                    }
                };
                checkChrome();
            }
        });
    }


    /**
     * Initializes the script once the document is ready.
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    /**
     * Starts the main logic: initial scan and sets up the observer.
     */
    start() {
        console.log('Starting Facebook Post Header Extension');
        this.scanForHeaders();
        this.setupMutationObserver();
    }

    /**
     * Finds post headers and adds the icon. This is the core logic.
     */
    scanForHeaders() {
        const actionButtons = document.querySelectorAll(this.ACTION_BUTTON_SELECTOR);

        actionButtons.forEach(button => {
            // Find the closest parent container that represents the entire header area.
            const header = button.closest('div[class*="x1qx5ct2 x1y1aw1k xf159sx "]');

            if (header && !this.processedHeaders.has(header)) {
                this.processedHeaders.add(header);
                this.addIconToHeader(header);
            }
        });
    }

    /**
     * Adds the interactive icon to a discovered header element.
     */
    addIconToHeader(header) {
        // Create the icon container
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'fb-extension-icon';
        iconWrapper.style.position = 'absolute';
        iconWrapper.style.top = '0';
        iconWrapper.style.marginRight = '30px';
        iconWrapper.style.marginTop = '2px';
        

        // Create the button
        const iconButton = document.createElement('button');
        iconButton.className = 'fb-extension-button';
        // iconButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        //     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        // </svg>`;
        iconButton.innerHTML = "R";

        // Add click event to perform sequential clicks and extract iframe
        iconButton.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await this.performSequentialActions(e);
        });

        iconWrapper.appendChild(iconButton);

        // Ensure the header can contain a positioned element
        header.style.position = 'relative';
        header.appendChild(iconWrapper);
        console.log('Icon added to a header.');
    }

    /**
     * Performs the sequential clicking actions and extracts iframe src
     */
    async performSequentialActions(e) {
        try {
            await this.waitForChromeAPI();
        } catch (error) {
            console.error('Error during wait for chrome:', error);
        }

        try {
            // Step 1: Click first selector
            const parentEle1 = e.target.parentElement;
            const parentEle = parentEle1.parentElement;
            console.log(parentEle);
            const firstElement = parentEle.firstElementChild.firstElementChild;
            if (firstElement) {
                console.log(firstElement);
                const realClick = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                firstElement.dispatchEvent(realClick);
                console.log('Clicked first element');
                this.showNotification('Loading options menu...', 'info');

                // Wait for menu to appear with polling mechanism
                const hideAdElement = await this.waitForHideAdElement(5000); // Wait up to 5 seconds

                if (hideAdElement) {
                    this.showNotification('Menu loaded successfully', 'success');
                    console.log('Found Hide ad element:', hideAdElement);

                    // Traverse up to the relevant parent (replace .parentElement as needed)
                    const parentDiv = hideAdElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                    console.log("parent of hide ad", parentDiv);

                    // Search for element with "embed" inside parentDiv
                    let embedElement = null;
                    Array.from(parentDiv.querySelectorAll('*')).forEach((el) => {
                        if (
                            el.innerText &&
                            el.innerText.trim().toLowerCase().includes('embed')
                        ) {
                            embedElement = el;
                        }
                    });

                    if (embedElement) {
                        console.log("Found embed element:", embedElement);
                        const realClick = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                        embedElement.dispatchEvent(realClick);

                        // Wait briefly for iframe to appear after click if needed
                        await this.delay(1000);

                        // Find iframe with class "xl1xv1r" and get its src attribute
                        const iframe = document.querySelector('iframe');
                        if (iframe && iframe.src) {
                            chrome.runtime.sendMessage({ action: "saveLink", link: iframe.src, platform: "FACEBOOK" }, response => {
                                if (response.success) {
                                    console.log("Saved to Supabase!");
                                }
                            });

                            // --- NEW: After success, click at specific screen position ---
                            setTimeout(() => {
                                const clickEvent = new MouseEvent('click', {
                                    bubbles: true,
                                    cancelable: true,
                                    clientX: 50, // X Coordinate
                                    clientY: 50  // Y Coordinate
                                });
                                document.elementFromPoint(50, 50)?.dispatchEvent(clickEvent);
                            }, 500); // adjust delay if needed
                        } else {
                            alert('Iframe with class "xl1xv1r" not found or missing src.');
                        }
                    } else {
                        console.log("No embed element found in parentDiv.");
                    }
                } else {
                    alert('This was not an ad Post');
                    // Or use: this.showNotification('This was not an ad message', 'error');
                    // --- NEW: Retry by clicking firstElement again ---
                    setTimeout(() => {
                        const retryClick = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                        firstElement.dispatchEvent(retryClick);
                    }, 500); // Retry click after short delay
                }
            } else {
                this.showNotification('First element not found', 'error');
            }

        } catch (error) {
            console.error('Error during sequential actions:', error);
            this.showNotification('Error occurred during extraction', 'error');
        }
    }


    /**
     * Shows a popup with the extracted iframe src - not used
     */
    showIframeSrcPopup(iframeSrc) {
        // Remove any existing iframe popup
        document.querySelector('.fb-extension-iframe-popup')?.remove();

        const popup = document.createElement('div');
        popup.className = 'fb-extension-iframe-popup';
        popup.innerHTML = `
            <div class="popup-header">
                <h4>📺 Iframe Source Extracted</h4>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="popup-content">
                <p><strong>Iframe URL:</strong></p>
                <div class="url-display">${iframeSrc}</div>
                <div class="popup-actions">
                    <button onclick="navigator.clipboard.writeText('${iframeSrc}').then(() => alert('Copied to clipboard!'))">
                        📋 Copy URL
                    </button>
                    <button onclick="window.open('${iframeSrc}', '_blank')">
                        🔗 Open in New Tab
                    </button>
                </div>
            </div>
        `;

        // Style the popup
        popup.style.cssText = `
            position: fixed;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #1877f2;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 400px;
            max-width: 600px;
            font-family: Arial, sans-serif;
        `;

        // Add styles for popup content
        const style = document.createElement('style');
        style.textContent = `
            .fb-extension-iframe-popup .popup-header {
                background: #1877f2;
                color: white;
                padding: 12px 16px;
                border-radius: 6px 6px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .fb-extension-iframe-popup .popup-header h4 {
                margin: 0;
                font-size: 16px;
            }
            .fb-extension-iframe-popup .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
            }
            .fb-extension-iframe-popup .popup-content {
                padding: 16px;
            }
            .fb-extension-iframe-popup .url-display {
                background: #f0f2f5;
                padding: 10px;
                border-radius: 4px;
                font-family: monospace;
                font-size: 12px;
                word-break: break-all;
                margin: 8px 0;
                border: 1px solid #ddd;
            }
            .fb-extension-iframe-popup .popup-actions {
                display: flex;
                gap: 10px;
                margin-top: 16px;
            }
            .fb-extension-iframe-popup .popup-actions button {
                padding: 8px 16px;
                border: 1px solid #1877f2;
                background: white;
                color: #1877f2;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            .fb-extension-iframe-popup .popup-actions button:hover {
                background: #1877f2;
                color: white;
            }
        `;

        if (!document.head.querySelector('style[data-fb-extension]')) {
            style.setAttribute('data-fb-extension', 'true');
            document.head.appendChild(style);
        }

        document.body.appendChild(popup);
        this.showNotification('Iframe URL extracted successfully!', 'success');
    }

    /**
     * Utility function to create delays between actions
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Waits for the "hide ad" element to appear in the DOM with polling
     * @param {number} timeout - Maximum time to wait in milliseconds
     * @returns {Promise<Element|null>} The found element or null if timeout
     */
    async waitForHideAdElement(timeout = 5000) {
        const startTime = Date.now();
        const pollInterval = 200; // Check every 200ms

        while (Date.now() - startTime < timeout) {
            const allElements = document.querySelectorAll('*');
            let hideAdElement = null;
            
            allElements.forEach((el) => {
                if (
                    el.innerText &&
                    el.innerText.trim().toLowerCase().includes('hide ad')
                ) {
                    hideAdElement = el;
                }
            });

            if (hideAdElement) {
                console.log('Found "hide ad" element after', Date.now() - startTime, 'ms');
                return hideAdElement;
            }

            // Wait before next poll
            await this.delay(pollInterval);
        }

        console.log('Timeout waiting for "hide ad" element after', timeout, 'ms');
        return null;
    }

    /**
     * Shows a temporary notification message on the screen.
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'fb-extension-notification';
        notification.textContent = message;

        // Style based on notification type
        const colors = {
            info: { bg: '#e3f2fd', border: '#2196f3', color: '#1976d2' },
            success: { bg: '#e8f5e8', border: '#4caf50', color: '#388e3c' },
            error: { bg: '#ffebee', border: '#f44336', color: '#d32f2f' }
        };

        const color = colors[type] || colors.info;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color.bg};
            color: ${color.color};
            border: 1px solid ${color.border};
            border-radius: 4px;
            padding: 12px 16px;
            font-size: 14px;
            font-family: Arial, sans-serif;
            z-index: 10001;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            max-width: 300px;
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }

    /**
     * Observes the page for new content and re-runs the scan.
     */
    setupMutationObserver() {
        this.observer = new MutationObserver(() => {
            // Use a timeout to "debounce" the scan, preventing it from running too often.
            clearTimeout(this.processTimeout);
            this.processTimeout = setTimeout(() => this.scanForHeaders(), 500);
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
}

// Initialize the extension safely.
try {
    new FacebookPostHeaderExtension();
} catch (error) {
    console.error('Failed to initialize Facebook Post Header Extension:', error);
}
