import numpy as np
import MagnitudeScaler as scaler
def getMarkerText(record):
    names = {"torn": "Tornado", "hail":"Hail", "wind":"Severe Wind"}
    measures = {"torn": "(F scale)" , "hail":"(inches)", "wind":"(knots)"}
    return f"<b>{names[record[0]]}</b><br>Magnitude: {record[2]} {measures[record[0]]}<br>Loss: {round(record[3],2)}"

def getWeatherMagnitudeOverMonths(selected_year,results):
    months = [1,2,3,4,5,6,7,8,9,10,11,12] 
    dataset = {
        "torn":{
            "x":months,
            "y":list(),
            "s":list(),
            "text":list()
        },
        "hail":{
            "x":months,
            "y":list(),
            "s":list(),
            "text":list()
        },
        "wind":{
            "x":months,
            "y":list(),
            "s":list(),
            "text":list()
        }
    }
    for res in results:
        if(res[1]==(len(dataset[res[0]]["y"])+1)):
            dataset[res[0]]["y"].append(int(scaler.getScaledMagnitude(res[0],res[2])))
            if(int(selected_year) == 2016):
                print(round(res[3]/1000000,1))
                dataset[res[0]]["s"].append(round(res[3]/1000000,1))
            else:
                dataset[res[0]]["s"].append(round(res[3],1))
            dataset[res[0]]["text"].append(getMarkerText(res))
        else:
            dataset[res[0]]["y"].append(0)
            dataset[res[0]]["s"].append(0)
            dataset[res[0]]["text"].append('')
    return dataset