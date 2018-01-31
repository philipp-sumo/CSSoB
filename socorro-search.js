observeFacetAdded();

function observeFacetAdded() {
    // Options for the observer (which mutations to observe)
    var config = {
        attributes: false,
        childList: true,
        subtree: false
    };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList) {
        for (var mutation of mutationsList) {
            if (!document.querySelector("div#facet-signature")) {
                return;
            } else if (document.querySelector("div#facet-signature")) {
                addBugStatus();
                return;
            }
        }
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(document.querySelector('div#search_results'), config);
}