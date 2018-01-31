var Release;
var Beta;
var StatusString;
var StatusRelease;
var StatusBeta;
var bugdata;

function addBugStatus() {
    var bugids = $('a.bug-link').map(function(i) {
        return $(this).attr("data-id");
    });

    browser.storage.local.get(function(res) {
        Release = parseInt(res.Release);
        Beta = parseInt(res.Beta);
        StatusString = res.StatusString;
        StatusRelease = "cf_status_firefox" + Release;
        StatusBeta = "cf_status_firefox" + Beta;

        $.when($.getJSON("https://bugzilla.mozilla.org/rest/bug?id=" + $.unique(bugids).get().join(',') + "&include_fields=id,last_change_time,resolution,status,target_milestone," + StatusRelease + "," + StatusBeta, function(json) {
            bugdata = json;
        })).done(function() {
            $.when(
                $("a.bug-link-with-data:not([data-status])").each(function() {
                    var self = $(this);
                    $.each(bugdata.bugs, function(i, v) {
                        if (v.id == self.attr("data-id")) {
                            self.attr({
                                "data-status": v.status,
                                "data-resolution": v.resolution
                            });
                            return;
                        }
                    });
                })
            ).done(function() {
                addBugStyle();
                checkFixed();
            });
            $("a.bug-link-with-data[data-resolution='']").each(function() {
                var self = $(this);
                var lasttouched;
                $.each(bugdata.bugs, function(i, v) {
                    if (v.id == self.attr("data-id")) {
                        lasttouched = Math.round((Date.now() - new Date(v.last_change_time)) / 86400000);
                        self.css("background-color", "" + activitylevel(lasttouched) + "");
                        return;
                    }
                });
            });
        });
    });
}

function activitylevel(days) {
    if (days <= 7) {
        return "lightgreen";
    } else if (days > 7 && days <= 40) {
        return "yellow";
    } else if (days > 40) {
        return "lightpink";
    }
}

function checkFixed() {
    $("a.bug-link-with-data[data-resolution='FIXED']").each(function() {
        var self = $(this);
        $.each(bugdata.bugs, function(i, v) {
            if (v.id == self.attr("data-id")) {
                if ((v[StatusRelease] == "fixed" || v[StatusRelease] == "verified") && Release < parseInt(v.target_milestone.replace('mozilla', ''))) {
                    self.append("&#8593;" + Release);
                    return;
                } else if ((v[StatusBeta] == "fixed" || v[StatusBeta] == "verified") && Beta < parseInt(v.target_milestone.replace('mozilla', ''))) {
                    self.append("&#8593;" + Beta);
                    return;
                } else {
                    self.append(+(v.target_milestone).replace('mozilla', ''));
                    return;
                }
            }
        });
    });
}

function addBugStyle() {
    $("a.bug-link-with-data[data-resolution='FIXED']").removeClass("strike").empty().prepend("FIX");
    $("a.bug-link-with-data[data-resolution='INCOMPLETE']").remove();
    $("a.bug-link-with-data[data-resolution='WORKSFORME']").remove();
    $("a.bug-link-with-data[data-resolution='WONTFIX']").removeClass("strike").empty().prepend("WONT");
    $("a.bug-link-with-data[data-resolution='INVALID']").removeClass("strike").empty().prepend("INVA");
    $("a.bug-link-with-data[data-resolution='DUPLICATE']").removeClass("strike").empty().prepend("DUPE");
    $("a.bug-link-with-data[data-status='UNCONFIRMED']").prepend("UNCON&nbsp;");
    $("a.bug-link-with-data[data-status='NEW']").prepend("NEW&nbsp;");
    $("a.bug-link-with-data[data-status='ASSIGNED']").prepend("ASSIG&nbsp;");
    $("a.bug-link-with-data[data-status='REOPENED']").prepend("REOP&nbsp;");
}