$("#eye-closed").click(function () {
        $("#eye-closed").hide();
        $("#eye-open").show();
        $("#senha").get(0).type='text';
})

$("#eye-open").click(function () {
    $("#eye-open").hide();
    $("#eye-closed").show();
    $("#senha").get(0).type='password';
})