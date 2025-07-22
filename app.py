from flask import Flask, render_template, request, url_for, flash, jsonify
from werkzeug.utils import redirect
from flask_mysqldb import MySQL

app = Flask(__name__)
app.secret_key = 'some_random_data'


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = "root"
app.config['MYSQL_PASSWORD'] = ""
app.config['MYSQL_DB'] = "inventory"

mysql = MySQL(app)

@app.route('/')
def Index():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM soft_drinks_tbl")
    data = cursor.fetchall()
    cursor.close()
    print(data)
    return render_template('index.html', drinks=data)

 @app.route('/delete/<int:id>', methods=["POST", "DELETE"])
def delete(id):
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM soft_drinks_tbl WHERE id = %s", (id,))
    mysql.connection.commit()
    cursor.close()
    return redirect(url_for('Index'))