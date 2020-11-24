function onSubmitAddTonSubmitSentFormLandingimeline() {
    event.preventDefault();
    $('#contact').submit();
}
function showLoader() {
    $("#preloader").css("visibility", "visible").css("opacity", "1").fadeIn();
}
function hideLoader() {
    $("#preloader").css("visibility", "hidden").css("opacity", "0").fadeOut();
}
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$('#contact').on('submit', function (e) {
    e.preventDefault();
    showLoader();

    var email = document.getElementById("email").value;
    if (!validateEmail(email)) {
        alert("EMAIL ERRATA");
        hideLoader();
    }
    else {
        var other_data = $('#contact :input').serializeArray();
        $.ajax({
            type: "POST",
            url: "/contact",
            data: other_data,
            success: function (data) {
                hideLoader();
                alert("GRAZIE PER ESSERTI ISCRITTO");
                location.reload();
            },
            error: function (request, status, error) {
                hideLoader();
                console.log(error);
                alert('ERRORE! :(');
            },
            complete: function () {
                console.log("complete");
            }
        });
    }
});