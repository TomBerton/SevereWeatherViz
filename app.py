from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
<<<<<<< HEAD
from sqlalchemy import create_engine, func
from sqlalchemy import inspect

=======
from sqlalchemy import func
from sqlalchemy import create_engine,MetaData,Table,Column
import BubbleUtilities
>>>>>>> origin/BubbleChart

from flask import (
    Flask,
    render_template,
    jsonify)

app = Flask(__name__)

<<<<<<< HEAD
=======
engine = create_engine('sqlite:///SevereWeather.sqlite')
metadata = MetaData()
metadata.reflect(engine)
Base = automap_base(metadata=metadata)
Base.prepare()
Base.metadata.tables
from sqlalchemy import inspect,func
inspector = inspect(engine)
Events = Table('Events',metadata)
inspector.reflecttable(Events,None)
session = Session(bind=engine)

>>>>>>> origin/BubbleChart
#home route
@app.route("/")
def home():
    return render_template("index.html")

<<<<<<< HEAD
=======
@app.route("/bubble/<selected_year>")
def getBubbleChart(selected_year):
    results = session.query(Events.columns['type'],Events.columns['mo'],func.max(Events.columns['mag']),func.sum(Events.columns['loss'])).\
        filter(Events.columns['yr'] == selected_year).\
        filter(Events.columns['mag'] >= 0).\
        group_by(Events.columns['type'],Events.columns['mo']).\
        order_by(Events.columns['mo']).all()

    print(results)
    dataset = BubbleUtilities.getWeatherMagnitudeOverMonths(selected_year,results)
    print(dataset)
    return jsonify(dataset)
>>>>>>> origin/BubbleChart

if __name__ == "__main__":
    app.run()