function addCrashStopLink() {
    const cssig = $(".page-heading > h2 > em").text();
	
	$("<a href='https://crash-stop-addon.herokuapp.com/sumup.html?s="+cssig+"' target='_blank' title='look up crash stop data' rel='noreferrer noopener'><img src='data:image/png;base64,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' alt='Clouseau' height='32' width='32'></a>").insertAfter(".page-heading > h2");
}	 

addCrashStopLink()