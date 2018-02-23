from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import inspect


from flask import (
    Flask,
    render_template,
    jsonify)

app = Flask(__name__)

#home route
@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    app.run()