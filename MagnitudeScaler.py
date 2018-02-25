# Currently - 
#     torn ranges 0 - 6  (F-scale)
#     hail ranges 0 - 8  (inches)
#     wind ranges 30 - 131  (knots)
# After conversion of wind knots to force
#     wind force will be in range 0 - 12
#     torn ranges 0 - 6
#     hail ranges 0 - 8
# LCM of the three highs are 48. So let's base our scale factors on that.
# Scale factors : Torn: 8, Wind: 4, Hail: 6

def getScaledMagnitude(weather_type,magnitude):
    if(weather_type == "torn"):
        if(magnitude == -9):
            return 0
        else:
            return round(magnitude,0)*8
    elif(weather_type == "hail"):
        return round(magnitude,0)*6
    elif(weather_type == "wind"):
        wind_force = convertKnotstoForce(magnitude)
        return round(wind_force,0)*4

def convertKnotstoForce(magnitude):
    if(magnitude < 1):
        return 0
    if(magnitude <= 3):
        return 1
    if(magnitude <= 6):
        return 2
    if(magnitude <= 10):
        return 3
    if(magnitude <= 16):
        return 4
    if(magnitude <= 21):
        return 5
    if(magnitude <= 27):
        return 6
    if(magnitude <= 33):
        return 7
    if(magnitude <= 40):
        return 8
    if(magnitude <= 47):
        return 9
    if(magnitude <= 55):
        return 10
    if(magnitude <= 63):
        return 11
    if(magnitude > 63):
        return 12