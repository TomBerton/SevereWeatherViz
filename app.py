from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy import create_engine,MetaData,Table,Column
import BubbleUtilities

from flask import (
    Flask,
    render_template,
    jsonify)

app = Flask(__name__)

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

#home route
@app.route("/")
def home():
    return render_template("index.html")

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

@app.route("/piechart/<year>")
def getPieChart(year):
    total_loss_results = session.query(func.sum(Events.columns['loss'])).\
            filter(Events.columns['yr'] == year).first()
    total_loss = round(total_loss_results[0],2)
    print(total_loss)
    results = session.query(Events.columns['type'],(func.sum(Events.columns['loss'])/total_loss)*100).\
             filter(Events.columns['yr'] == year).\
             group_by(Events.columns['type'])
            
    pie_chart_data = {
        'labels':[],
        'values':[],
        'type':'pie'
    }
    for r in results:
        pie_chart_data['labels'].append(r[0])
        pie_chart_data['values'].append(round(r[1]))
        
    return jsonify(pie_chart_data)
    

if __name__ == "__main__":
    app.run()