from sql_connection import get_sql_connection

def get_product_details(connection):
    cursor = connection.cursor()

    query = """
        SELECT
            Products.product_id,
            Products.name,
            Products.uom_id,
            Products.price_per_unit,
            unit_of_measurement.uom_name
        FROM Products
        INNER JOIN unit_of_measurement
            ON Products.uom_id = unit_of_measurement.uom_id
    """

    cursor.execute(query)

    response = []

    for (product_id, name, uom_id, price_per_unit, uom_name) in cursor:
        response.append({
            "product_id": product_id,
            "name": name,
            "uom_id": uom_id,
            "price_per_unit": price_per_unit,
            "uom_name": uom_name
        })

    return response
    
def insert_new_product(connection, Products):
    cursor = connection.cursor()
    query = ("INSERT INTO Products (name, uom_id, price_per_unit) VALUES (%s, %s, %s)")
    data = (Products['product_name'], Products['uom_id'], Products['price_per_unit'])
    cursor.execute(query, data)
    connection.commit()
    return cursor.lastrowid

def delete_product(connection, product_id):
    cursor = connection.cursor()
    query = ("DELETE FROM Products WHERE product_id = %s")
    cursor.execute(query, (product_id,))
    connection.commit()


if __name__ == "__main__":
    connection = get_sql_connection()
    print(delete_product(connection,4))