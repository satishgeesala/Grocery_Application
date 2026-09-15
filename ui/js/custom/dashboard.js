$(function () {
    //Json data by api call for order table
    $.get(orderListApiUrl, function (response) {
        if(response) {
            var table = '';
            var totalCost = 0;
            $.each(response, function(index, order) {
                totalCost += parseFloat(order.total);
                table += '<tr>' +
                    '<td>'+ order.datetime +'</td>'+
                    '<td>'+ order.order_id +'</td>'+
                    '<td>'+ order.customer_name +'</td>'+
                    '<td>'+ order.total.toFixed(2) +' Rs</td>'+
                    '<td><button type="button" class="btn btn-sm btn-info view-order" data-order-id="'+ order.order_id +'">View</button></td></tr>';
            });
            table += '<tr><td colspan="3" style="text-align: end"><b>Total</b></td><td><b>'+ totalCost.toFixed(2) +' Rs</b></td><td></td></tr>';
            $("table").find('tbody').empty().html(table);
        }
    });
});

$(document).on("click", ".view-order", function () {
    var orderId = $(this).data("order-id");
    $.get(orderDetailsApiUrl + '?order_id=' + orderId, function (response) {
        var rows = '';
        $.each(response, function (index, item) {
            rows += '<tr>' +
                '<td>'+ item.name +' ('+ item.uom_name +')</td>'+
                '<td>'+ item.quantity +'</td>'+
                '<td>'+ parseFloat(item.total_price).toFixed(2) +' Rs</td></tr>';
        });
        $("#orderDetailsBody").empty().html(rows);
        $("#orderDetailsModal").modal('show');
    });
});