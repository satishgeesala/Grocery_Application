import mysql.connector
__cnx = None

def get_sql_connection():
        global __cnx
        if __cnx is None:
            __cnx = mysql.connector.connect(
                user='root', password='Geesala@202120',
                host='127.0.0.1',
                database='Grocery_store')
        return __cnx