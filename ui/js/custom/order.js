var productPrices = {};

$(function () {
    //Json data by api call for order table
    $.get(productListApiUrl, function (response) {
        productPrices = {}
        if(response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function(index, product) {
                options += '<option value="'+ product.product_id +'">'+ product.name +'</option>';
                productPrices[product.product_id] = product.price_per_unit;
            });
            $(".product-box").find("select").empty().html(options);
        }
    });
});

$("#addMoreButton").click(function () {
    var row = $(".product-box").html();
    $(".product-box-extra").append(row);
    $(".product-box-extra .remove-row").last().removeClass('hideit');
    $(".product-box-extra .product-price").last().text('0.0');
    $(".product-box-extra .product-qty").last().val('1');
    $(".product-box-extra .product-total").last().text('0.0');
});


$(document).on("click", ".remove-row", function (){
    $(this).closest('.row').remove();
    calculateValue();
});


$(document).on("change", ".cart-product", function () {
    var product_id = $(this).val();
    var price = productPrices[product_id] || 0;

    var row = $(this).closest('.product-item');

    row.find('.product-price').val(price);

    var qty = parseFloat(row.find('.product-qty').val()) || 0;
    var itemTotal = price * qty;

    row.find('.product-total').val(itemTotal.toFixed(2));

    calculateValue();
});

// $(document).on("change", ".cart-product", function (){
//     var product_id = $(this).val();
//     var price = productPrices[product_id];

//     $(this).closest('.row').find('#product_price').val(price);
//     calculateValue();
// });

// $(document).on("input change", ".product-price", function (){
//     calculateValue();
// });


$(document).on("input change", ".product-price, .product-qty", function () {
    var row = $(this).closest('.product-item');

    var price = parseFloat(row.find('.product-price').val()) || 0;
    var qty = parseFloat(row.find('.product-qty').val()) || 0;

    var itemTotal = price * qty;

    row.find('.product-total').val(itemTotal.toFixed(2));

    calculateValue();
});

$(document).on("input change", ".product-total", function () {
    calculateValue();
});


$("#saveOrder").on("click", function(){

    // 1. Validate customer name
    var customerName = $("#customerName").val().trim();

    if (customerName === "") {
        alert("Please enter customer name.");
        $("#customerName").focus();
        return;
    }

    // 2. Validate whether at least one product is added
    var rows = $("#itemsInOrder .product-item");

    if (rows.length === 0) {
        alert("Please add at least one product.");
        return;
    }

    // 3. Validate each product and quantity
    var isValid = true;

    rows.each(function () {

        var product = $(this).find(".cart-product").val();
        var qty = $(this).find(".product-qty").val();
        var quantity = Number(qty);

        if (!product) {
            alert("Please select a product.");
            $(this).find(".cart-product").focus();
            isValid = false;
            return false;
        }

        if (qty === "" || !Number.isFinite(quantity) || quantity <= 0) {
            alert("Please enter a valid quantity greater than zero.");
            $(this).find(".product-qty").focus();
            isValid = false;
            return false;
        }

    });

    if (!isValid) {
        return;
    }

    // Keep your existing save-order code below this line
    // 4. Prepare order data
    var formData = $("form").serializeArray();
    var requestPayload = {
        customer_name: null,
        grand_total: null,
        order_details: []
    };
    var orderDetails = [];
    for(var i=0;i<formData.length;++i) {
        var element = formData[i];
        var lastElement = null;

        switch(element.name) {
            case 'customerName':
                requestPayload.customer_name = element.value;
                break;
            case 'product_grand_total':
                requestPayload.total = element.value;
                break;
            case 'product':
                requestPayload.order_details.push({
                    product_id: element.value,
                    quantity: null,
                    total_price: null
                });                
                break;
            case 'qty':
                lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                lastElement.quantity = element.value
                break;
            case 'item_total':
                lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                lastElement.price = element.value;
                break;
        }

    }
    callApi("POST", orderSaveApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});