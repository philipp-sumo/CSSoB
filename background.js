$.getJSON("https://product-details.mozilla.org/1.0/firefox_versions.json", function(json) {
    browser.storage.local.set({
		"Release": parseInt((json.LATEST_FIREFOX_VERSION).split('.')[0]),
		"Beta": parseInt((json.LATEST_FIREFOX_VERSION).split('.')[0])+1
    });
});