'''
this is a rough tool set for generating images using the cairo graphics library
for python 3.x. i started using this workflow during the summer of 2018 and I
contine to build on it todayself.

i believe that each piece of art in existance is fundmentilly a routine running
inside of an enviroment comprised of initial and boundry conditions. those
conditions can take the form of materials, time, budget, skill level of the
artist, the tools available, the laws of physics, social norms, the historical
and political context of the moment, and a host of other limitations on expression.
i have no idea what makes a piece of art great in general, but i personally
find the most enjoyment in art that is challenging or pushing the edge of some
boundry condition. in short - i think that the conditions that shaped the production
of the art are the most intersting thing about the piece.

with all of that in mind, my conditions are supremely uninterestingself.

to do list:

turn common sub routines into functions:

- angled lines
- triangles
- squares
- rectangles
- time stamp each output in a folder
- JSON file with each of the random values from a canvas
- black and white coloring
- ovals
- learn how to use a fade effect
-



'''


import cairocffi as cairo
import math
import numpy as np
import random
import os
import datetime
import time

#useful commands
#dc.move_to(x,y)

def RGBconv(value):
    return value/256

def circle(dc, x, y, r):
    dc.new_sub_path()
    dc.arc(x, y, r, 0, 2 * math.pi)
    dc.set_source_rgb(RGBconv(256),RGBconv(256),RGBconv(256))
    dc.set_line_width(1)
    dc.stroke()
    #dc.set_source_rgb(RGBconv(256),RGBconv(256),RGBconv(256))
    #dc.fill()

def square(dc, x, y, w, h):
    dc.new_sub_path()
    dc.rectangle(x, y, w, h)

def hexagon(dc,D,x,y):
    alpha = D/4
    beta = math.sqrt(3)*alpha
    p = (
        (x+beta,y+alpha),
        (x,y+2*alpha),
        (x-beta,y+alpha),
        (x-beta,y-alpha),
        (x,y-2*alpha),
        (x+beta,y-alpha)
        )
    dc.move_to(x+beta,y+alpha)
    for pair in p:
        dc.line_to(pair[0],pair[1])
    dc.close_path()

    #set outline color
    dc.set_source_rgb(RGBconv(256),RGBconv(256),RGBconv(256))
    dc.set_line_width(5)
    dc.stroke()

    #set fill color
    dc.set_source_rgb(RGBconv(0),RGBconv(0),RGBconv(0))
    dc.fill()

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





#this is the funtion that draws the images
def images(num_images):


    #start of drawing functions
    for value in range(num_images):

        #start of canvas prep
        w = 3000 # image width for instagram
        h = 3000  # image height for instagram

        surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, w, h)
        dc = cairo.Context(surface) # drawing context
        red = RGBconv(0)
        green = RGBconv(0)
        blue = RGBconv(0)
        dc.set_source_rgb(red, green, blue)
        dc.paint()

        #end of canvas prep


        instances = random.randint(1,5)
        for instance in range (instances):
            x_points = w
            offset = h/2 + random.randint(0,500) - random.randint(0,500)
            period = random.randint(1,5)
            scale = random.random()
            radius = random.randint(50,250)
            which = random.random()

            if which >= 0.66:
                for x in range(x_points):
                    y_loc = (scale*math.sin(x/(x_points/period)*math.pi)*h)+offset
                    circle(dc, x, y_loc, radius)

            if 0.33 < which < 0.66:
                for x in range(x_points):
                    y_loc = (scale*math.tan(x/(x_points/period)*math.pi)*h)+offset
                    circle(dc, x, y_loc, radius)

            else:
                for x in range(x_points):
                    y_loc = (scale*math.cos(x/(x_points/period)*math.pi)*h)+offset
                    circle(dc, x, y_loc, radius)






        #end of the drawing function

        filename = 'img' + str(value) + '.png'
        surface.write_to_png(filename)
        print(filename)



def main():
    scale = 1
    images(10)



if __name__ == '__main__':
    main()


#ffmpeg -r 1/5 -i fc%03d.png -c:v libx264 -vf fps=25 -pix_fmt yuv420p out.mp4
# ffmpeg -i img%03d.png out.mp4
# ffmpeg -framerate 12 -i img%03d.png out.mp4
# -vcodec libx264

# ffmpeg -pattern_type glob -i '*.JPG' -vcodec libx264 -s 640x480 -pix_fmt yuv420p movie.mp4

#ffmpeg -framerate 15 -i img%03d.png -vcodec libx264 -pix_fmt yuv420p movie.mp4
