'''
Eduardo Torrealba 2018
'''

import math
import random
import numpy as np

def RGBconv(value):
    return value/256

#N sided polygons

color = {
      'red': [1, 0, 0],
      'black': [0,0,0],
      'white': [1,1,1]
    }


def elipse(dc,x,y,width,theta,color):
    rho = np.deg2rad(theta)
    dc.save()
    dc.translate(x,y)
    dc.rotate(2*math.pi-rho)
    dc.scale(1, 2/3)
    dc.translate(-x,-y)
    dc.new_path()
    dc.arc(x,y, width, 0, 2*math.pi)
    dc.restore()
    if color:
        red = RGBconv(256)
        green = RGBconv(0)
        blue = RGBconv(0)
        dc.set_source_rgb(red, green, blue)
    else:
        red = RGBconv(256)
        green = RGBconv(256)
        blue = RGBconv(256)
        dc.set_source_rgb(red, green, blue)

    dc.fill()


def triangle(dc, x, y, h, theta):
    theta = np.deg2rad(theta)
    o = math.sin(theta)*h
    a = math.cos(theta)*h

    dc.save()
    dc.translate(x,y)
    dc.rotate(2*math.pi-theta)
    dc.new_path()

    p = (
        (x,y),
        (x,y+o),
        (x+a,y),
        (x,y)
        )
    dc.move_to(x,y)
    for pair in p:
        dc.line_to(pair[0],pair[1])
    #dc.close_path()

    dc.restore()

    #set outline color
    dc.set_source_rgb(RGBconv(0),RGBconv(0),RGBconv(0))
    dc.set_line_width(1)
    dc.stroke()

    #set fill color
    #dc.set_source_rgb(RGBconv(0),RGBconv(0),RGBconv(0))
    #dc.fill()

def square(dc, x, y, w):
    dc.new_sub_path()
    dc.rectangle(x-w/2, y-w/2, w, w)
    #set outline color
    dc.set_source_rgb(RGBconv(0),RGBconv(0),RGBconv(0))
    dc.set_line_width(1)
    dc.stroke()


    #set fill color
    #dc.set_source_rgb(RGBconv(0),RGBconv(0),RGBconv(0))
    #dc.fill()

#def pentagon(dc,x,y,...)

def hexagon(dc,D,x,y,w):
    alpha = D/4
    beta = math.sqrt(3)*alpha
    p = (
        (x+beta,y+alpha),
        (x,y+2*alpha),
        (x-beta,y+alpha),
        (x-beta,y-alpha),
        (x,y-2*alpha),
        (x+beta,y-alpha),
        (x+beta,y+alpha)
        )
    dc.move_to(x+beta,y+alpha)
    for pair in p:
        dc.line_to(pair[0],pair[1])
    #dc.close_path()

    #set outline color
    dc.set_source_rgb(RGBconv(256),RGBconv(256),RGBconv(256))
    dc.set_line_width(w)
    dc.stroke()

    #set fill color
    #dc.set_source_rgb(RGBconv(0),RGBconv(0),RGBconv(0))
    #dc.fill()

def circle(dc, x, y, r, w, col):
    dc.new_sub_path()
    dc.arc(x, y, r, 0, 2 * math.pi)
    dc.set_source_rgb(color[col][0],color[col][1],color[col][2])
    dc.set_line_width(w)
    dc.stroke()


def hemisphere(dc,d,x,y,theta):
    dc.move_to(x,y)
    #values for first line
    theta = np.deg2rad(theta)
    y1 = int(-1*((d*np.sin(theta))-y))
    x1 = int(d*np.cos(theta)+x)
    x_mid = int((d/2)*np.cos(theta)+x)
    y_mid = int(-1*(((d/2)*np.sin(theta))-y))

    dc.line_to(x1,y1)
    dc.move_to(x_mid,y_mid)
    #dc.arc(x_mid,y_mid,d/2,theta,math.pi/2-theta)
    dc.arc_negative(x_mid,y_mid,d/2,theta+math.pi/2,2*math.pi-theta)
    dc.set_source_rgb(RGBconv(249),RGBconv(245),RGBconv(158))
    dc.fill()

def piettangle(dc,x1,y1,x2,y2,color):
    p = (
        (x1,y1),
        (x2,y1),
        (x2,y2),
        (x1,y2)
        )
    dc.move_to(x1,y1)
    for pair in p:
        dc.line_to(pair[0],pair[1])
    dc.close_path()
    dc.set_source_rgb(RGBconv(0),RGBconv(0),RGBconv(0))
    dc.set_line_width(2)
    dc.stroke_preserve()

    if color == 0:
        #red
        dc.set_source_rgb(RGBconv(256),RGBconv(0),RGBconv(0))
        dc.fill()

    if color == 1:
        #blue
        dc.set_source_rgb(RGBconv(0),RGBconv(0),RGBconv(256))
        dc.fill()

    if color == 2:
        #yellow
        dc.set_source_rgb(RGBconv(256),RGBconv(256),RGBconv(0))
        dc.fill()

    if color == 3:
        #white
        dc.set_source_rgb(RGBconv(256),RGBconv(256),RGBconv(256))
        dc.fill()

def piettangle_no(dc,x1,y1,x2,y2,color):
    p = (
        (x1,y1),
        (x2,y1),
        (x2,y2),
        (x1,y2)
        )
    dc.move_to(x1,y1)
    for pair in p:
        dc.line_to(pair[0],pair[1])
    dc.close_path()
    dc.set_source_rgb(RGBconv(0),RGBconv(0),RGBconv(0))
    dc.set_line_width(2)
    dc.stroke_preserve()

    if color == 0:
        #red
        dc.set_source_rgb(RGBconv(256),RGBconv(0),RGBconv(0))
        dc.fill()

    if color == 1:
        #blue
        dc.set_source_rgb(RGBconv(0),RGBconv(0),RGBconv(256))
        dc.fill()

    if color == 2:
        #yellow
        dc.set_source_rgb(RGBconv(256),RGBconv(256),RGBconv(0))
        dc.fill()

    if color == 3:
        #white
        dc.set_source_rgb(RGBconv(256),RGBconv(256),RGBconv(256))
        dc.fill()


def zurich(dc,mid_x,mid_y,frame,frames,max_length,num_arms):
    dc.move_to(mid_x,mid_y)

    angle = 2*math.pi/num_arms

    complete = frame/frames
    points = []

    for i in range(num_arms):
        x = math.cos(angle*i)*max_length*complete
        y = math.sin(angle*i)*max_length*complete
        points.append([x,y])


    for pair in points:
        dc.move_to(mid_x,mid_y)
        dc.line_to(pair[0],pair[1])
        dc.set_source_rgb(RGBconv(256),RGBconv(256),RGBconv(256))
        dc.set_line_width(5)
        dc.stroke_preserve()

def paris_offset(max):
    return random.randint(0,max) - random.randint(0,max)

    

def skew_poly(dc,w,h,size):

    fudge = random.randint(0,size) - random.randint(0,size)
    start_x = int(.1*w) + int(0.1*fudge)
    start_y = 0
    f_s = random.random()
    p = (
        (start_x,start_y),
        (int(.9*w) + int(f_s*fudge),0),
        (int(.7*w) + int(f_s*fudge),size),
        (int(.3*w) + int(f_s*fudge),size)
        )
    dc.move_to(start_x,start_y)
    for pair in p:
        dc.line_to(pair[0],pair[1])
    dc.close_path()

    coin = random.random()

    if coin >= 0.5:
        dc.set_source_rgb(RGBconv(256),RGBconv(256),RGBconv(256))
    else:
        dc.set_source_rgb(RGBconv(0),RGBconv(0),RGBconv(0))
    dc.fill()
    
    
def radial_squares(dc):
        attempts = 1 #random.randint(10,20)

        for i in range(attempts):
            r = 100 #random.randint(100,150)
            theta = 0
            width = random.randint(10,50)
            spots = 5 #random.randint(100,900)
            switch = random.random()
            change = random.randint(1,50)

            for j in range(spots):
                theta = np.deg2rad(theta)
                x = int(r*np.cos(theta))
                y = int(r*np.sin(theta))
                ardo.square(dc, x, y, width)
                theta =int(j/spots*(360*3))
                if switch >= 0.5:
                    theta = (-1*theta)
                r += 100
