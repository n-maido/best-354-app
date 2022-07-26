
// Validate the form inputs for searching donor_contact
function validateInputs(form) {
    let alert = false;
    let alert_msg = "An input is missing for: \n";
    let missingFields = [];

    console.log(form.name.value);
    if (form.name.value === "") {
        console.log("empty")
        alert = true;
        missingFields.push("Name");
        alert_msg += "Name\n";
    }
    if (alert) {
        window.alert(alert_msg);
    } else {
        form.submit();
    }
}
