//Stripe.setPublishableKey('pk_test_g3aQi40xHFZB4yzIzkxCXoMB');
var stripe = Stripe('pk_test_g3aQi40xHFZB4yzIzkxCXoMB');
var elements = stripe.elements();

var $form = $('#buy');
//var $form = $('#checkout-form');

//$("#id-placeorder").click(function(e) {
////    e.preventDefault();
//    console.log("place order");
//    $form.submit(function(event) {
//        $('#charge-errors').hide();
//        $form.find('button').prop('disabled', true);
//        Stripe.card.createToken({
//            number: $('#number').val(),
//            cvc: $('#cvv').val(),
//            exp_month: $('#expr-month').val(),
//            exp_year: $('#expr-year').val(),
//            address_zip: $('#zip').val(),
//            name: $('#name').val()
//        }, stripeResponseHandler);
//        return false;
//    });
//});

$("#id-placeorder").click(function(e) {
    console.log("place order");
    $form.click(function(event) {
//        event.preventDefault();
        console.log("place order inside");
        $('#charge-errors').hide();
//        $form.prop('disabled', true);
//        return false;
    });
});

function stripeResponseHandler(status, response) {
    if (response.error) { // Problem!

        // Show the errors on the form
        $('#charge-errors').text(response.error.message);
        $('#charge-errors').show();
        $form.prop('disabled', false); // Re-enable submission
//        $form.find('button').prop('disabled', false); // Re-enable submission

    } else { // Token was created!
        // Get the token ID:
        var token = response.id;
        // Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        // Submit the form:
        $form.get(0).submit();
    }
}