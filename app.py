@app.route('/fetchdata', methods=['GET'])
def fetchItems():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM soft_drinks_tbl")
    data = cursor.fetchall()
    cursor.close()
    return jsonify({"data":data})