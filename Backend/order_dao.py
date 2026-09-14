from datetime import datetime
from sql_connection import get_sql_connection

def insert_order(connection, order):
    cursor = connection.cursor()
    order_query = ("insert into orders(customer_name, total, datetime) values (%s, %s, %s)")
    order_data = (order['customer_name'], order['total'], datetime.now())

    cursor.execute(order_query, order_data)
    order_id = cursor.lastrowid

    order_details_query = ("insert into order_details(order_id, product_id, quantity, total_price) values (%s, %s, %s, %s)")
    order_details_data = []
    for order_details_record in order['order_details']:
        order_details_data.append([
            order_id,
            int(order_details_record['product_id']),
            float(order_details_record['quantity']),
            float(order_details_record['price'])
        ])

    cursor.executemany(order_details_query, order_details_data)

    connection.commit()
    return order_id

def get_all_orders(connection):
    cursor = connection.cursor()
    query = ("select * from orders")
    cursor.execute(query)
    response = []

    for (order_id, customer_name, total, datetime) in cursor:
        response.append({
            'order_id': order_id,
            'customer_name': customer_name,
            'total': total,
            'datetime': datetime
        })
    return response

# update :
def get_order_details(connection, order_id):
    cursor = connection.cursor()
    query = ("select od.product_id, p.name, od.quantity, od.total_price, u.uom_name "
              "from order_details od "
              "inner join Products p on od.product_id = p.product_id "
              "inner join unit_of_measurement u on p.uom_id = u.uom_id "
              "where od.order_id = %s")
    cursor.execute(query, (order_id,))
    response = []
    for (product_id, name, quantity, total_price, uom_name) in cursor:
        response.append({
            'product_id': product_id,
            'name': name,
            'quantity': quantity,
            'total_price': total_price,
            'uom_name': uom_name
        })
    return response

if __name__ == '__main__':
    connection = get_sql_connection()
    print(get_all_orders(connection))
    # {
    #     'customer_name': 'Satish',
    #     'total': 500,
    #     'order_details' : [
    #         {
    #             'product_id': 1,
    #             'quantity': 2,
    #             'price': 50,
    #         },
    #         {
    #             'product_id': 3,
    #             'quantity': 1,
    #             'price': 30,
    #         }
            
    #     ]

    # }))