from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

from sqlalchemy import create_engine, func
from sqlalchemy import inspect


from sqlalchemy import func
from sqlalchemy import create_engine,MetaData,Table,Column
import BubbleUtilities

import pandas as pd


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


#home route
@app.route("/statewide")
def stateshome():
    return render_template("states.html")

@app.route("/states")
def getStates():
    states_df = pd.read_csv('datasets/state_wise_data.csv')
    return jsonify(states_df.to_dict(orient='records'))

@app.route("/state/<state_code>")
def getTypeEventCountByState(state_code):
    results = session.query(Events.columns['type'],func.count(Events.columns['loss'])).\
             filter(Events.columns['st'] == state_code).\
             group_by(Events.columns['type']).\
             order_by(Events.columns['st'] ).all()

    return jsonify(results)


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

@app.route("/events/<query>")
def getevent(query):
    state_list = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']
    empty_list = []
    for s in state_list:
        wind_count = 0
        torn_count = 0
        hail_count = 0
        empty_dict = {}
        state_results = session.query(Events).\
        filter(Events.columns.st == s).\
        filter(Events.columns.yr == query)
        for a in state_results:
            if a.type == "wind":
                wind_count+= 1
            elif a.type == "torn":
                torn_count += 1
            else:
                hail_count += 1      
        empty_dict['ST'] = s
        empty_dict["Tornados"] = torn_count
        empty_dict["Hail"] = hail_count
        empty_dict["Wind"] = wind_count
        empty_dict["Year"] = query
        empty_dict["Total Events"] = torn_count + hail_count + wind_count
        empty_list.append(empty_dict)

    return jsonify(empty_list)


@app.route("/coords/<year>")
def getCoords(year):
    results = session.query(Events.columns.yr, Events.columns.st, Events.columns.slat, Events.columns.slon, Events.columns.type, Events.columns.mag, Events.columns.date_time).\
    filter(Events.columns.yr == year)
    empty_coords = []
    for result in results:
        empty_coords.append(result)
    
    return jsonify(empty_coords)



@app.route("/piechart/<year>")
def getPieChart(year):
    total_loss_results = session.query(func.sum(Events.columns['loss'])).\
            filter(Events.columns['yr'] == year).first()

    total_crop_loss_results = session.query(func.sum(Events.columns['closs'])).\
            filter(Events.columns['yr'] == year).first()
    total_loss = round(total_loss_results[0],2)
    total_crop_loss = round(total_crop_loss_results[0],2)
    if year != "2016":
        conv_total_loss = total_loss * 1000000
        conv_total_crop = total_crop_loss * 1000000
    else:
        conv_total_loss = total_loss
        conv_total_crop = total_crop_loss
    complete_loss = conv_total_loss + conv_total_crop
    print(total_crop_loss)
    print(total_loss)
    print(complete_loss)
    results = session.query(Events.columns['type'],(func.sum(Events.columns['loss'])/total_loss)*100).\
            filter(Events.columns['yr'] == year).\
            group_by(Events.columns['type'])
    
    inj_results = session.query(Events.columns.type,func.sum(Events.columns.inj), func.sum(Events.columns.fat)).\
            group_by(Events.columns.type)            
    inj_list = []
    for i in inj_results:
        inj_dict = {}
        inj_dict["Year"] = year
        inj_dict["Type"] = i[0]
        inj_dict["Injuries"] = i[1]
        inj_dict["Fatalities"] = i[2]
        inj_list.append(inj_dict)
    print(inj_list)
    pie_chart_data = {
        'labels':[],
        'values':[],
        'total_loss': conv_total_loss,
        'total_crop_loss' : conv_total_crop,
        'total_complete_loss' : complete_loss,
        'injury_data' : inj_list
    }
    
    for r in results:
        pie_chart_data['labels'].append(r[0])
        pie_chart_data['values'].append(round(r[1]))
        
    return jsonify(pie_chart_data)

if __name__ == "__main__":
    app.run(debug = True)
