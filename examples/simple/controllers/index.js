
function showAlert()
{
    alert("Click! Shouldn't do it again though");
    
    // test removing it
    b.off("click",showAlert);
}


/**
 * 'b' is a magic predefined variabale automatically generated and available in your controller
 */
b.on("click",showAlert);



