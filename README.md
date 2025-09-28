# Chrome/Edge Extension (Webpack Bundled)

## 📌 Overview

This project is a **browser extension** (compatible with **Google Chrome** and **Microsoft Edge**) that uses **Webpack** to bundle JavaScript, HTML, and CSS into a packaged extension.

The extension supports:

* **Content Scripts** injected into web pages.
* A **Background Script** to handle event-driven logic.
* A **Popup UI** for quick user interactions.
* An **Options Page** for extension configuration.
* Shared styles and assets bundled via Webpack.

---

## 🗂 File Structure

```
├── manifest.json         # Extension configuration (entry points, permissions, UI)
├── background.js         # Background/service worker script (event-driven logic)
├── content.js            # Injected script that runs inside web pages
├── popup.html            # Extension popup UI (toolbar button)
├── popup.js              # Logic for popup UI
├── options.html          # Extension options/settings page
├── styles.css            # Shared styles for popup/options
├── webpack.config.js     # Webpack build configuration
├── package.json          # NPM config (scripts, dependencies)
├── package-lock.json     # Dependency lock file
```

---

## ⚙️ How It Works

1. **Manifest.json**

   * Registers extension components with the browser.
   * Declares permissions, background script, content script, popup, and options page.

2. **Background Script (`background.js`)**

   * Runs in the extension’s background context.
   * Handles events like browser actions, messages, alarms, and tab updates.
   * Acts as a **central message broker** between popup, options, and content scripts.

3. **Content Script (`content.js`)**

   * Injected into web pages declared in `manifest.json`.
   * Interacts with the DOM and sends/receives messages from the background script.

4. **Popup UI (`popup.html`, `popup.js`)**

   * Opens when the user clicks the extension’s toolbar button.
   * Provides a quick interactive interface with the background script.

5. **Options Page (`options.html`)**

   * Provides a settings interface for persistent configuration.
   * Uses `chrome.storage` API to save/retrieve user preferences.

6. **Webpack (`webpack.config.js`)**

   * Bundles JavaScript files into optimized extension scripts.
   * Outputs a `/dist` folder containing the final packaged extension.

---

## 🔄 Component Interactions

* **Manifest.json** → Registers all components with the browser.
* **Background Script** ↔ **Content Script** → Communicate via `chrome.runtime.sendMessage` & `chrome.tabs.sendMessage`.
* **Background Script** ↔ **Popup UI** → Enables user-triggered actions from the toolbar popup.
* **Background Script** ↔ **Options Page** → Handles persistent settings using `chrome.storage`.
* **Content Script** → Manipulates webpage DOM, requests data from background.

---

## 🛠 Build & Development

### 1. Install dependencies

```bash
npm install
```

### 2. Build the extension

```bash
npx webpack
```

* Bundled files will be placed in the `dist/` directory.
* Copy the `manifest.json`, HTML files, and CSS into `dist/` if not handled automatically.

### 3. Load in Chrome/Edge

1. Open **chrome://extensions/** (or **edge://extensions/**).
2. Enable **Developer Mode**.
3. Click **Load unpacked**.
4. Select the `dist/` folder.

---

## 📚 Technologies Used

* **JavaScript (Vanilla)** – core logic
* **HTML / CSS** – UI components
* **Webpack** – bundling and asset pipeline
* **Chrome Extension APIs**

  * `runtime` (messaging)
  * `tabs` (tab manipulation)
  * `storage` (persistent user data)

---

## 📐 Architecture Diagram

```plaintext
              ┌────────────────────┐
              │    manifest.json    │
              └─────────┬──────────┘
                        │
      ┌─────────────────┼─────────────────┐
      │                 │                 │
┌─────────────┐   ┌──────────────┐   ┌─────────────┐
│ Background  │   │  Content.js  │   │   Popup UI  │
│  background │←→ │ (web page)   │   │ popup.html/js│
└─────────────┘   └──────────────┘   └─────────────┘
      │                                 │
      │                                 │
      ▼                                 ▼
┌──────────────┐                 ┌──────────────┐
│ chrome.tabs  │                 │ Options Page │
│ chrome.storage│                 │ options.html │
└──────────────┘                 └──────────────┘
```

At build time:

```
Source Files → Webpack → dist/ (packaged extension)
```

---

## 🚀 Future Enhancements

* Add automated testing for content/background scripts.
* Improve Webpack config with minification and asset copying.
* Add internationalization (i18n) support.
* CI/CD pipeline for automated packaging.

---

## 📄 License

This project is licensed under the **MIT License**.
