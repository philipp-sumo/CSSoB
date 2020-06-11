//reverts behaviour to pre https://bugzilla.mozilla.org/show_bug.cgi?id=1608873
function fixLinks() {
$("#frames a[href^='https://hg.mozilla.org']")
   .each(function()
   { 
      this.href = this.href.replace(/\/file\//, 
         "/annotate/");
   });
}

fixLinks();