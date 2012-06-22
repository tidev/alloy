function showAlert()
{
    alert("Click! Shouldn't do it again though");
    
    // test removing it
    $.b.off("click",showAlert);
}

$.b.on("click",showAlert);
if (ENV_DEV) {
	alert('development mode');
}

$.index.open();



